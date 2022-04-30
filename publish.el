;; Set the package installation directory so that packages aren't stored in the
;; ~/.emacs.d/elpa path.
(require 'package)
(setq package-user-dir (expand-file-name "./.packages"))
(setq package-archives '(("melpa" . "https://melpa.org/packages/")
                         ("elpa" . "https://elpa.gnu.org/packages/")))

;; Initialize the package system
(package-initialize)
(unless package-archive-contents
  (package-refresh-contents))

;; load org and publishing system
(require 'org)
(require 'ox-publish)

(defvar my/website-html-preamble 
  "<nav>
<ul>
<li><a href='/pages'>Home</a></li>
<li><a href='/blog'>Blog</a></li>
<li><a href='http://github.com/MrWalshyType2'>GitHub</a></li>
</ul>
</nav>")

(defvar my/website-blog-preamble 
  "<nav>
<ul>
<li><a href='/pages'>Home</a></li>
</ul>
</nav>")

(defvar my/website-html-postamble 
  "<footer>
Copyright 2022 %a (%v HTML).<br>
Last updated %C. <br>
Built with %c.
</footer>")

(defvar my/website-html-head
  "<link rel=\"stylesheet\" href=\"/css/style.css\" type=\"text/css\" />\n")


;; Use C-c C-l (org-insert-link) for links between files
(setq org-publish-project-alist
      `(("org-pages"
         :base-directory "./org/pages" ;; source files
         :base-extension "org" ;; type of file
         :recursive nil
         :publishing-directory "./html/pages/" ;; export location
         :publishing-function org-html-publish-to-html
         
         :html-doctype "html5" ;; html 5 doctype
         :html-html5-fancy t
         :html-head ,my/website-html-head
         :html-preamble ,my/website-html-preamble
         :html-postamble ,my/website-html-postamble
         ;;:auto-preamble t

         :with-toc t ;; table of contents
         :section-numbers nil
         :headline-levels 4

         :author "Morgan Walsh"
         :with-author t
         :language "en"
         :time-stamp-file nil
         :with-creator t ;; Emacs and Org version in footer
         
         
         ;; :auto-sitemap t
         ;; :sitemap-filename "./index.org"
         ;; :sitemap-title "Blog index"
         ;; :sitemap-sort-folders "first"
         ;; :sitemap-sort-files anti-chronologically
         ;; :sitemap-file-entry-format: "%d - %t"
         ;; :sitemap-function m/org-publish-org-sitemap-format-entry
         ;; :sitemap-format-entry my/org-sitemap-date-entry-format
         ) ;; export type, to html
         ("org-blog"
          :base-directory "./org/blog"
          :base-extension: "org"
          :recursive t
          :publishing-directory "./html/blog/"
          :publishing-function org-html-publish-to-html
          :html-doctype "html5"
          :html-html5-fancy t
          :html-head ,my/website-html-head
          :html-preamble ,my/website-blog-preamble
          :html-postamble ,my/website-html-postamble
          
          :with-toc t
          :section-numbers nil
          :headline-levels 4

          :auto-sitemap t
          :sitemap-filename "./index.org"
          :sitemap-style tree
          :sitemap-file-entry-format "%d - %t") ;; entry format being ignored?
         ("org-static"
          :base-directory "./org/"
          :base-extension "js\\|css\\|txt\\|jpg\\|gif\\|png"
          :recursive t
          :publishing-directory "./html/"
          :publishing-function org-publish-attachment) ;; copy verbatim, no modification
         ("org" :components ("org-pages" "org-static" "org-blog"))))

(setq org-html-validation-link nil) ;; disable verify link

;; evaluate the code
;; type C-c C-e to open Org Export Dispatcher
;; - P for publishing, a to publish all

;; also, eval from elisp to also publish it:
;;   (org-publish "morganwalsh.dev" t)
;; - t arg is optional, forces every file to re-export even if file has not changed


;; build files
;;(org-publish-all t)
;;(org-publish-project "org" t)


;;(message "Build complete")

