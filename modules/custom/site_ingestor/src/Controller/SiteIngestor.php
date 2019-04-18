<?php

namespace Drupal\site_ingestor\Controller;

use Drupal\site_ingestor\Controller\SimpleHtmlDom;

class SiteIngestor {

  public $url;
  public $dest;
  public $systemName;
  public $humanName;
  public $originalBodyTag;
  public $page;
  private $xpath;
  private $cssDir;
  private $imgDir;
  private $jsDir;
  private $linkedDir;
  private $downloadedFiles = array();
  private $fileList = array();
  private $DOMDoc;
  private $docRoot;
  private $SimpleHtmlDom;

  /*   * *
   * Constructor
   * @param string $url - The url to ingest
   * @param string $dest - The destination folder for the copied site
   * @param string $systemName - The sanitized system name for the copied site
   * @param string $humanName - The human readable name for the copied site
   * @param string $docRoot - The document root of the server the site will be copied to
   * @param bool $forceExternalHTTPS - If true, each URL marked to be left external will first be tested for HTTPS connectivity. If HTTPS is not available, the link will be stored locally.
   * @param string $cssDir - Where the CSS files should be stored, relative to the destination path
   * @param string $imgDir - Where the image files should be stored, relative to the destination path
   * @param string $jsDir - Where the JS files should be stored, relative to the destination path
   * @param string $linkedDir - Where the linked files (favicon, etc) should be stored, relative to the destination path
   * @param string $cssAssetsDir - Where the assets found in CSS files should be stored, relative to the destination path
   */

  public function __construct($url, $dest, $systemName, $humanName, $docRoot = '', $forceExternalHTTPS = TRUE, $cssDir = 'css', $imgDir = 'img', $jsDir = 'js', $linkedDir = 'linked', $cssAssetsDir = 'cssAssets') {
    if (isset($url)) {
      if (strpos($url, 'http') !== 0) {
        $url = 'http://' . $url;
      }
      $this->url = $url;
    }
    else {
      return false;
    }
    // store settings
    $this->systemName = $systemName;
    $this->humanName = $humanName;
    $this->dest = $dest;
    $this->cssDir = $cssDir;
    $this->imgDir = $imgDir;
    $this->jsDir = $jsDir;
    $this->linkedDir = $linkedDir;
    $this->cssAssetsDir = $cssAssetsDir;
    $this->forceExternalHTTPS = $forceExternalHTTPS;
    $this->docRoot = $docRoot;
    $this->SimpleHtmlDom = new SimpleHtmlDom($url);
  }

  /**
   * Downloads the original file, decompresses it and performs
   * encoding changes if necessary, then loads it into a DOMDoc
   */
  public function init() {

    $this->page = $this->filegetContents($this->url);
    \Drupal::logger('site_ingestor')->debug($this->url, array());
//var_dump($this->page);die();
    if ($this->page !== false) {
      $this->page = $this->checkCompression($this->page);
    }
    else {
      return false;
    }

    // Use mb_detect_order to find out the order of detection of a string.
    // By Default 1 is for UTF-8.
    if (mb_check_encoding($this->page) != '1') {
      // Force UTF8 encoding
      $this->page = mb_convert_encoding($this->page, '1', mb_check_encoding($this->page));
      $this->page = str_replace('charset=windows-1251', 'charset=utf-8', $this->page);
      $this->page = str_replace('charset=iso-8859-1', 'charset=utf-8', $this->page);
    }

    $DOMDoc = new \DOMDocument();

    //Supress libxml error messages.
    libxml_use_internal_errors(true);

    if (mb_check_encoding($this->page) != '1') {
      // XML hack to force DOMDoc to use UTF-8
      $DOMDoc->loadHTML('<?xml version="1.0" encoding="UTF-8"?>' . $this->page);
    }
    else {
      $DOMDoc->loadHTML($this->page);
    }
    $this->xpath = new \DOMXPath($DOMDoc);
    $this->DOMDoc = $DOMDoc;

    return true;
  }

  /**
   * Checks whether a file is gzipped,
   * if so, returns decompressed file,
   * otherwise returns original file.
   * @param $file
   * @return bool|null|string
   */
  private function checkCompression($file) {
    if (isset($file[0]) && isset($file[1])) {
      if (bin2hex($file[0] . $file[1]) == '1f8b')
        return gzdecode($file);
    }
    return $file;
  }

  /**
   * Check whether a given URL responds 200
   * @param $url
   * @return bool
   */
  public function checkURL($url) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 3);
    curl_setopt($ch, CURLOPT_HEADER, TRUE);
    curl_setopt($ch, CURLOPT_NOBODY, TRUE); // remove body
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode == 200)
      return true;
    else
      return false;
  }

  /**
   * Fetch all content of the page.
   * @param $url
   * @return bool
   */
  public function filegetContents($url) {
    $curl_handle = curl_init();
    curl_setopt($curl_handle, CURLOPT_URL, $url);
    curl_setopt($curl_handle, CURLOPT_CONNECTTIMEOUT, 10);
    curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl_handle, CURLOPT_USERAGENT, 'Mozilla/5.0 (X11; Linux x86_64; rv:12.0) Gecko/20100101 Firefox/21.0');
    $data = curl_exec($curl_handle);
    curl_close($curl_handle);

    return $data;
  }

  /**
   * Scans the index file and builds the list of
   * which can be downloaded for each file.
   * Returns false if xpath is unavailable.
   * @return bool
   */
  public function buildFileList() {
    if (!isset($this->xpath))
      return false;

    // Get all linked assets
    $this->fileList[$this->cssDir] = $this->getCSSFilePaths();
    $this->fileList[$this->imgDir] = $this->getImageFilePaths();
    $this->fileList[$this->jsDir] = $this->getJSFilePaths();
    $this->fileList[$this->cssAssetsDir] = array_merge($this->getInlineCSSAssets(), $this->getCSSAssetPaths());
    $this->fileList[$this->linkedDir] = $this->getLinkedFilePaths();

    // While we have XPath, rewrite any relative links in the index
    $this->rewriteLinks();

    return true;
  }

  /**
   * Creates an array containing the original path, which is
   * used in the replace functions as the target, and the clean path,
   * which will be replacement
   */
  private function cleanPath($parentPath, $path) {
    $paths = array();
    $path = trim($path);
    // We need to alter the original path to remove spaces,
    // DOMDoc will convert these to %20 automatically, so we need
    // the same value when we do the replacements later
    $paths['original'] = str_replace(' ', '%20', $path);

    // Set protocol to http if protocol-relative URL is used
    if (strpos($path, '//') === 0)
      $path = 'http:' . $path;

    $parentPathParts = parse_url($parentPath);
    $pathParts = parse_url($path);
    $cleanPath = array();

    // break out the components of the URL
    // this helps ensure that the resulting path
    // has a fully qualified URL
    $cleanPath['scheme'] = isset($pathParts['scheme']) ? $pathParts['scheme'] : $parentPathParts['scheme'];
    $cleanPath['host'] = isset($pathParts['host']) ? $pathParts['host'] : $parentPathParts['host'];
    $cleanPath['query'] = isset($pathParts['query']) ? '?' . $pathParts['query'] : '';

    // If path is relative and is using '..', create absolute path by
    // walking up parent path n number of directories
    if (strpos($path, '../') !== FALSE) {
      // Count how many directories need to be walked up
      $cdUpCount = substr_count($pathParts['path'], '../');
      $pathParts['path'] = substr($pathParts['path'], strrpos($pathParts['path'], '../') + 3);
      $parentDirs = array();
      // If parent url has path, walk up
      if (isset($parentPathParts['path'])) {
        $parentDirs = explode('/', $parentPathParts['path']);
        for ($i = 0; $i <= $cdUpCount; $i++) {
          array_pop($parentDirs);
        }
      }
      $cleanPath['path'] = implode('/', $parentDirs) . '/' . $pathParts['path'];
    }
    // If the path is relative, determine the absolute path
    // by combining the parent path with the relative path
    else if (strpos($path, '/') !== 0 && isset($pathParts['path']) && strpos($pathParts['path'], '/') !== 0) {
      if (!isset($parentPathParts['path']))
        $parentDirectory = '';
      else
        $parentDirectory = substr($parentPathParts['path'], 0, strrpos($parentPathParts['path'], '/'));

      $cleanPath['path'] = $parentDirectory . '/' . $pathParts['path'];
    }
    // If there is no path, leave the path piece empty, this is a domain link
    else if (!isset($pathParts['path'])) {
      $cleanPath['path'] = '';
    }
    // The path was already absolute, leave it be
    else {
      $cleanPath['path'] = $pathParts['path'];
    }

    // Make sure we convert spaces to %20 for the clean path
    $cleanPath['path'] = str_replace(' ', '%20', $cleanPath['path']);

    // Build the fully qualified url
    $paths['clean'] = $cleanPath['scheme'] . '://' . $cleanPath['host'] . $cleanPath['path'] . $cleanPath['query'];

    return $paths;
  }

  /**
   * Find img or input[type=image] assets
   */
  public function getImageFilePaths() {
    $files = array();
    $query = $this->xpath->query("//img/@src");
    for ($i = 0; $i < $query->length; $i++) {
      $path = $this->cleanPath($this->url, $query->item($i)->textContent);
      $files[$path['original']] = $path;
    }
    $query = $this->xpath->query("//input[@type='image']/@src");
    for ($i = 0; $i < $query->length; $i++) {
      $path = $this->cleanPath($this->url, $query->item($i)->textContent);
      $files[$path['original']] = $path;
    }
    return $files;
  }

  /**
   * Find link[rel=stylesheet] assets,
   * any CSS includes hidden in conditional comments,
   * and CSS includes hidden in document.write calls.
   */
  public function getCSSFilePaths() {
    $files = array();
    $query = $this->xpath->query("//link[@rel='stylesheet']/@href");
    for ($i = 0; $i < $query->length; $i++) {
      $path = $this->cleanPath($this->url, $query->item($i)->textContent);
      $files[$path['original']] = $path;
    }
    // Find any css includes inside of conditional comments
    $conditionalCommentPattern = '/(<!--\[if.*?\]>)(.*?)(<!\[endif\]-->)+/si';
    preg_match_all($conditionalCommentPattern, $this->page, $matches);
    foreach ($matches[2] as $match) {
      $html = $this->SimpleHtmlDom->str_get_html($match);
      if ($html) {
        $cssLinks = $this->SimpleHtmlDom->find('link[rel=stylesheet]');
        foreach ($cssLinks as $cssLink) {
          $path = $this->cleanPath($this->url, $cssLink->href);
          $files[$path['original']] = $path;
        }
      }
    }

    // Find any css files hidden in JS document.write snippets
    $JSDocumentWritePattern = '/(document.write\(\')(.*?)(\'\))+/si';
    preg_match_all($JSDocumentWritePattern, $this->page, $matches);
    foreach ($matches[2] as $match) {
      $html = $this->SimpleHtmlDom->str_get_html($match);
      if ($html) {
        $cssLinks = $this->SimpleHtmlDom->find('link[rel=stylesheet]');
        foreach ($cssLinks as $cssLink) {
          $path = $this->cleanPath($this->url, $cssLink->href);
          $files[$path['original']] = $path;
        }
      }
    }

    return $files;
  }

  /**
   * Find other <link> assets,
   * excluding those which point to '#' or '/'
   */
  public function getLinkedFilePaths() {
    $files = array();
    // @todo Instead of excluding some rel types, perhaps we should only include
    // the ones we understand. See PGCS-154. That site had the following
    // additional rel types:  icon, pingback, alternate, EditURI, wlwmanifest
    $query = $this->xpath->query("//link[@rel!='stylesheet'and@rel!='canonical'and@rel!='shortlink']/@href");
    for ($i = 0; $i < $query->length; $i++) {
      $linkURL = $query->item($i)->textContent;
      // Building in a check which excludes relative anchor URLs
      if (strpos($linkURL, '#') !== 0 && strpos($linkURL, '/') !== 0) {
        $path = $this->cleanPath($this->url, $linkURL);
        $files[$path['original']] = $path;
      }
    }
    return $files;
  }

  /**
   * Find script assets,
   * any script includes hidden in conditional comments,
   * and script includes hidden in document.write calls (this is unlikely but just reusing the code above).
   */
  public function getJSFilePaths() {
    $files = array();
    $query = $this->xpath->query("//script/@src");

    for ($i = 0; $i < $query->length; $i++) {
      $path = $this->cleanPath($this->url, $query->item($i)->textContent);
      $files[$path['original']] = $path;
    }

    // Find any js includes inside of conditional comments
    $conditionalCommentPattern = '/(<!--\[if.*?\]>)(.*?)(<!\[endif\]-->)+/si';
    preg_match_all($conditionalCommentPattern, $this->page, $matches);
    foreach ($matches[2] as $match) {
      $html = $this->SimpleHtmlDom->str_get_html($match);
      if ($html) {
        $jsScripts = $this->SimpleHtmlDom->find('script');
        foreach ($jsScripts as $jsScript) {
          $path = $this->cleanPath($this->url, $jsScript->src);
          $files[$path['original']] = $path;
        }
      }
    }

    // Find any JS files hidden in JS document.write snippets
    $JSDocumentWritePattern = '/(document.write\(\')(.*?)(\'\))+/si';
    preg_match_all($JSDocumentWritePattern, $this->page, $matches);
    foreach ($matches[2] as $match) {
      $html = $this->SimpleHtmlDom->str_get_html($match);
      if ($html) {
        $jsScripts = $this->SimpleHtmlDom->find('script');
        foreach ($jsScripts as $jsScript) {
          $path = $this->cleanPath($this->url, $jsScript->href);
          $files[$path['original']] = $path;
        }
      }
    }

    return $files;
  }

  /**
   * Find assets included in provided CSS file
   * Imports found will be added to the files array as new CSS files
   * anything else will be returned in an array
   */
  public function scrapeCSSAssets($file, $path) {
    $urls = array();
    $url_pattern = '(([^\\\\\'", \(\)]*(\\\\.)?)+)';
    $urlfunc_pattern = 'url\((\'|")?(.*?)(\'|")?\)';
    $pattern = '/(' .
        '(@import\s*[\'"]' . $url_pattern . '[\'"])' .
        '|(@import\s*' . $urlfunc_pattern . ')' .
        '|(' . $urlfunc_pattern . ')' . ')/s';
    if (!preg_match_all($pattern, $file, $matches))
      return $urls;

    // @import '...'
    // @import "..."
    foreach ($matches[3] as $match)
    // Skip data urls
      if (!empty($match) && strpos($match, 'data:') === false) {
        $this->fileList[$this->cssDir][preg_replace('/\\\\(.)/u', '\\1', $match)] = $this->cleanPath($path, preg_replace('/\\\\(.)/u', '\\1', $match));

        if (!isset($urls[$path]))
          $urls[$path] = array();
        $cssPath = $this->cleanPath($path, preg_replace('/\\\\(.)/u', '\\1', $match));
        $urls[$path][preg_replace('/\\\\(.)/u', '\\1', $match)] = $cssPath;
      }

    // @import url(...)
    // @import url('...')
    // @import url("...")
    foreach ($matches[8] as $match)
    // Skip data urls
      if (!empty($match) && strpos($match, 'data:') === false) {
        $this->fileList[$this->cssDir][preg_replace('/\\\\(.)/u', '\\1', $match)] = $this->cleanPath($path, preg_replace('/\\\\(.)/u', '\\1', $match));

        if (!isset($urls[$path]))
          $urls[$path] = array();
        $cssPath = $this->cleanPath($path, preg_replace('/\\\\(.)/u', '\\1', $match));
        $urls[$path][preg_replace('/\\\\(.)/u', '\\1', $match)] = $cssPath;
      }

    // url(...)
    // url('...')
    // url("...")
    foreach ($matches[12] as $match) {
      // Skip data urls
      if (!empty($match) && strpos($match, 'data:') === false) {
        if (!isset($urls[$path]))
          $urls[$path] = array();
        $cssPath = $this->cleanPath($path, preg_replace('/\\\\(.)/u', '\\1', $match));
        $urls[$path][preg_replace('/\\\\(.)/u', '\\1', $match)] = $cssPath;
      }
    }

    return $urls;
  }

  /**
   * Applies the CSS scraper to the index file
   * @return array
   */
  public function getInlineCSSAssets() {
    return $this->scrapeCSSAssets($this->page, $this->url);
  }

  /**
   * Applies the CSS scraper to each of the CSS assets in the fileList
   * @return array|bool
   */
  public function getCSSAssetPaths() {
    $urls = array();
    if (sizeof($this->fileList[$this->cssDir])) {
      foreach ($this->fileList[$this->cssDir] as &$filePath) {
        $cleanPath = $filePath['clean'];
        // Create a stream
        $opts = array(
          'http' => array(
            'method' => "GET",
            'header' => "User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:12.0) Gecko/20100101 Firefox/21.0"
          )
        );

        $context = stream_context_create($opts);
        $cssFile = file_get_contents($cleanPath, null, $context);
        if ($cssFile)
          $cssFile = $this->checkCompression($cssFile);
        else
          return false;

        $cssFile = trim($cssFile);
        $urls = array_merge($urls, $this->scrapeCSSAssets($cssFile, $cleanPath));
      }
    }
    return $urls;
  }

  /**
   * Rewrites links in the index file and all css/js files in the
   * fileList. Uses the 'original' key from the fileList as the target
   * and the 'clean' value as the replacement
   */
  public function rewriteLinks() {
    // DOMDoc will occasionally destroy attributes on the body tag,
    // if there are any divs in the head. There's no elegant fix for this,
    // so I'm using a different DOM class to pull out the body class before
    // running the page through DOMDoc.
    $this->SimpleHtmlDom->str_get_html($this->page);
    $bodyTag = $this->SimpleHtmlDom->find('body');
    $bodyAttributes = $bodyTag[0]->getAllAttributes();
    $bodyAttributeString = '';
    foreach ($bodyAttributes as $attribute => $value) {
      $bodyAttributeString .= ' ' . $attribute . '="' . $value . '"';
    }

    $query = $this->xpath->query("//a/@href");
    for ($i = 0; $i < $query->length; $i++) {
      $href = $query->item($i)->nodeValue;
      // Skip anchor, js, & mailto links
      if (strpos($href, '#') === 0 || strpos($href, 'javascript:') === 0 || strpos($href, 'mailto:') === 0) {
        continue;
      }
      else {
        $path = $this->cleanPath($this->url, $query->item($i)->textContent);
        $pathParts = parse_url($path['clean']);
        $pathParts['query'] = isset($pathParts['query']) ? '?' . $pathParts['query'] : '';
        $pathParts['path'] = isset($pathParts['path']) ? $pathParts['path'] : '';
        $path['clean'] = $pathParts['scheme'] . '://' . $pathParts['host'] . $pathParts['path'] . $pathParts['query'];
        $query->item($i)->nodeValue = $path['clean'];
      }
    }
    $this->page = $this->DOMDoc->saveHTML($this->xpath->document);

    // If DOMDoc killed the body attributes, replace them
    if (strlen($bodyAttributeString) && strpos($this->page, '<body>') !== FALSE) {
      $fixedBodyTag = '<body' . $bodyAttributeString . '>';
      $this->page = str_replace('<body>', $fixedBodyTag, $this->page);
    }
  }

  /**
   * If file names are longer than 32 characters, use the filename's
   * MD5 hash instead
   */
  public function fileNameLengthCheck($fileName) {
    if (strlen($fileName) > 32)
      $fileName = md5($fileName);

    return $fileName;
  }

  /**
   * Takes an array of ids (array indexes) to exclude from download
   * @param $ids
   * @param string $type
   */
  public function excludeFiles($ids, $type = 'js') {
    if (!is_array($ids))
      $ids = array($ids);

    foreach ($ids as $id) {
      $this->fileList[$type][$id]['excludeDownload'] = TRUE;
    }
  }

  /**
   * Recursively deletes a directory and its contents
   * @param $dirname
   * @return bool
   */
  public function deleteDirectory($dirname) {
    $dir_handle = false;
    if (is_dir($dirname))
      $dir_handle = opendir($dirname);
    if ($dir_handle === false)
      return false;
    while ($file = readdir($dir_handle)) {
      if ($file != "." && $file != "..") {
        if (!is_dir($dirname . "/" . $file))
          unlink($dirname . "/" . $file);
        else
          $this->deleteDirectory($dirname . '/' . $file);
      }
    }
    closedir($dir_handle);
    rmdir($dirname);
    return true;
  }

  /**
   * Downloads all files which are not excluded in fileList into the folder stored in
   * $this->dest, also save $this->page as the index file, which is saved as $indexFileName.
   *
   * @param $indexFileName
   * @return string
   */
  public function downloadFiles($indexFileName) {
    $unreachableFiles = array();
    if (!count($this->fileList)) {
      return 'File List (SiteIngestor->buildFileList) must be built before downloading.';
    }

    // If directory exists, delete it
    if (!is_dir($this->dest)) {
      if (!mkdir($this->dest))
        return 'Failed to create directory.';
    } else {
      // This deletes all the asset folders
      // It will ignore any custom files in the destination root
      $this->deleteDirectory($this->dest . '/' . $this->cssDir);
      $this->deleteDirectory($this->dest . '/' . $this->imgDir);
      $this->deleteDirectory($this->dest . '/' . $this->jsDir);
      $this->deleteDirectory($this->dest . '/' . $this->linkedDir);
      $this->deleteDirectory($this->dest . '/' . $this->cssAssetsDir);
    }

    $downloaded = array();
    // Loop through the destination locations
    // and download their files, handling CSS assets separately
    // due to the structure of the fileList array
    foreach ($this->fileList as $location => &$files) {
      // Create the destination folders
      if (!is_dir($this->dest . '/' . $location)) {
        if (!mkdir($this->dest . '/' . $location))
          return 'Failed to create directory.';
      }
      // Download CSS file assets
      if ($location == $this->cssAssetsDir) {
        foreach ($files as &$files) {
          // The CSS assets are one level deeper than the index file assets
          foreach ($files as &$file) {
            // First make sure we want to download this file
            if (empty($file['excludeDownload'])) {
              // Make sure we haven't already downloaded the file
              if (empty($downloaded[$file['clean']])) {
                // Attempt to download the file
                if ($this->downloadFile($location, $file)) {
                  $downloaded[$file['clean']] = $file['localpath'];
                }
                // Couldn't download the file, add it to unreachableFiles
                else {
                  $unreachableFiles[] = $file['clean'];
                }
              }
              // If the file was already downloaded, find it's local path in the downloaded array
              else {
                $file['localpath'] = $downloaded[$file['clean']];
              }
              // If the file was excluded, check whether we are forcing HTTPS.
              // We already checked whether it was available when we built the file list,
              // so we can just swap the protocol if.
            }
            else if ($this->forceExternalHTTPS = TRUE) {
              $file['clean'] = str_replace('http', 'https', $file['clean']);
            }
          }
        }
      }
      // Download index file assets
      else {
        foreach ($files as &$file) {
          if (empty($file['excludeDownload'])) {
            if (empty($downloaded[$file['clean']])) {
              if ($this->downloadFile($location, $file)) {
                $downloaded[$file['clean']] = $file['localpath'];
              }
              else {
                $unreachableFiles[] = $file['clean'];
              }
            }
            else {
              $file['localpath'] = $downloaded[$file['clean']];
            }
          }
          else if ($this->forceExternalHTTPS = TRUE) {
            $file['clean'] = str_replace('http', 'https', $file['clean']);
          }
        }
      }
    }

    // Remove XML charset hack
    $this->page = str_replace('<?xml version="1.0" encoding="UTF-8"?>', '', $this->page);
    $this->page = str_replace('<?xml version="1.0" encoding="utf-8" ?>', '', $this->page);

    // Save index file
    $indexFileLocalPath = $this->dest . '/' . $indexFileName;
    file_put_contents($indexFileLocalPath, $this->page);
    $downloaded[$this->url] = $indexFileLocalPath;

    $this->downloadedFiles = $downloaded;

    $this->rewriteFilePaths($indexFileName);

    // if any assets couldn't be downloaded,
    // return an array containing them
    if (count($unreachableFiles))
      return $unreachableFiles;
    else
      return true;
  }

  /**
   * Loops over the fileList and rewrites all of the URLs
   * with their 'clean' counterpart in the index file and in all
   * CSS files
   */
  private function rewriteFilePaths($indexFileName) {
    // index file rewrites
    $indexFile = &$this->page;
    foreach ($this->fileList as $location => $files) {
      if ($location != $this->cssAssetsDir) {
        foreach ($files as $file) {
          if (!empty($file['localpath'])) {
            // If a local path exists, replace original path with it
            $relativeFilePath = substr($file['localpath'], strlen($this->docRoot));
            $replaceTarget = $file['original'];
            $indexFile = str_replace($replaceTarget, $relativeFilePath, $indexFile, $i);
            // Domdoc is converting html entities into their respective characters which is breaking
            // file name replacements when the original file name contains an ampersand, this hack fixes that
            if ($i == 0)
              $indexFile = str_replace(str_replace('&', '&amp;', $replaceTarget), $relativeFilePath, $indexFile);
          }
        }
      }
    }

    $indexFilePath = $this->dest . '/' . $indexFileName;
    file_put_contents($indexFilePath, $indexFile);

    // css file rewrites
    foreach ($this->fileList[$this->cssAssetsDir] as $cssFilePath => $files) {
      $remoteCSSFilePath = $cssFilePath;
      $cssFilePath = $this->downloadedFiles[$cssFilePath];
      // Create a stream
      $opts = array(
        'http' => array(
          'method' => "GET",
          'header' => "User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:12.0) Gecko/20100101 Firefox/21.0"
        )
      );

      $context = stream_context_create($opts);
      $cssFile = file_get_contents($cssFilePath, null, $context);
      foreach ($files as $file) {
        if (!empty($file['localpath'])) {
          // If a local path exists, replace original path with it
          $relativeFilePath = substr($file['localpath'], strlen($this->docRoot));
          $cssFile = str_replace($file['original'], $relativeFilePath, $cssFile, $i);
          // Domdoc is converting html entities into their respective characters which is breaking
          // file name replacements when the original file name contains an ampersand, this hack fixes that
          if ($i == 0)
            $cssFile = str_replace(str_replace('&', '&amp;', $file['original']), $relativeFilePath, $cssFile);
        }
      }
      file_put_contents($cssFilePath, $cssFile);
    }
  }

  /**
   * Attempts to download a file and save it with a unique
   * filename. Returns false if the file cannot be downloaded,
   * alters the original $file reference and adds a 'localpath'
   * key if successful.
   */
  private function downloadFile($location, &$file) {
    $URL = $file['clean'];

    // Build the local file path
    // We use pathinfo to pull apart the filename and extension
    // and also to remove any query parameters
    if (strpos($URL, '?') !== false) {
      $URL = substr($URL, 0, strpos($URL, '?'));
    }
    $path_parts = pathinfo($URL);
    if (isset($path_parts['extension'])) {
      $extension = $path_parts['extension'];
      // Check that the name of the file is < 32 characters, if not, use a hash
      $fileName = $this->fileNameLengthCheck($path_parts['filename']);
      $baseName = $fileName . '.' . $extension;
    }
    else {
      $fileName = $this->fileNameLengthCheck($path_parts['filename']);
      $baseName = $fileName;
    }

    $localFilePath = $this->dest . '/' . $location . '/' . $baseName;

    // If a file already exists with the same name, generate a unique id for the file
    if (file_exists($localFilePath)) {
      if (isset($extension)) {
        $fileName = uniqid() . '.' . $extension;
      }
      else {
        $fileName = uniqid();
      }

      $localFilePath = $this->dest . '/' . $location . '/' . $fileName;
    }
    // Create a stream
    $opts = array(
      'http' => array(
        'method' => "GET",
        'header' => "User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:12.0) Gecko/20100101 Firefox/21.0"
      )
    );

    $context = stream_context_create($opts);
    $fileContents = @file_get_contents($file['clean'], null, $context);
    if ($fileContents === FALSE)
      return false;

    file_put_contents($localFilePath, $this->checkCompression($fileContents));
    $file['localpath'] = $localFilePath;
    return $file;
  }

  /**
   * Returns the file list if it is populated,
   * false otherwise.
   * @return array|bool
   */
  public function getFileList() {
    if (count($this->fileList))
      return $this->fileList;
    else
      return false;
  }

}
