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

;; Install dependencies
(unless (package-installed-p 'htmlize)
  (package-install 'htmlize))

;; load org and publishing system
(require 'org)
(require 'ox-publish)

(defun file-to-string (file)
  "Loads a file from the specified path and returns a string representing its contents."
  (with-temp-buffer
    (insert-file-contents file)
    (buffer-string)))

(defvar my/website-html-preamble 
  (file-to-string "./org/html/preamble.html"))

(defvar my/website-html-postamble 
  (file-to-string "./org/html/postamble.html"))

(defvar my/website-html-head
  "<link rel='stylesheet' href='/css/style.css' type='text/css' />")

;; remove default css
(setq org-html-head-include-default-style nil
      org-html-head-include-scripts nil)

;; Use C-c C-l (org-insert-link) for links between files
(setq org-publish-project-alist
      `(("org-index"
         :base-directory "./org/"
         :base-extension "org"
         :recursive nil
         :publishing-directory "./" ;; export location
         :publishing-function org-html-publish-to-html

         :html-doctype "html5" ;; html 5 doctype
         :html-html5-fancy t
         :html-head ,my/website-html-head
         :html-preamble ,my/website-html-preamble
         :html-postamble ,my/website-html-postamble

         :with-toc nil ;; table of contents
         :section-numbers nil
         :headline-levels 4

         :author "Morgan Walsh"
         :with-author t
         :language "en"
         :time-stamp-file nil
         :with-creator t ;; Emacs and Org version in footer
         )
        ("org-pages"
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

         :with-toc nil ;; table of contents
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
          :base-extension: "org" ;; only org files
	  :exclude "*.draft.org" ;; drafts
          :recursive t
          :publishing-directory "./blog/"
          :publishing-function org-html-publish-to-html
          :html-doctype "html5"
          :html-html5-fancy t
          :html-head ,my/website-html-head
          :html-preamble ,my/website-html-preamble
          :html-postamble ,my/website-html-postamble
          
          :with-toc nil
          :section-numbers nil
          :headline-levels 6

          :auto-sitemap t
          :sitemap-filename "./index.org"
          :sitemap-style tree
	  :sitemap-sort-files anti-chronologically
          :sitemap-file-entry-format "%d - %t") ;; entry format being ignored?

	  :author "Morgan Walsh"
          :with-author t
          :language "en"
          :time-stamp-file t
          :with-creator t ;; Emacs and Org version in footer
         ("org-static"
          :base-directory "./org/"
          :base-extension "js\\|css\\|txt\\|jpg\\|gif\\|png"
          :recursive t
          :publishing-directory "./"
          :publishing-function org-publish-attachment) ;; copy verbatim, no modification
         ("org" :components ("org-static" "org-index" "org-pages" "org-blog"))))

(setq org-html-validation-link nil) ;; disable verify link

;; evaluate the code
;; type C-c C-e to open Org Export Dispatcher
;; - P for publishing, a to publish all

;; also, eval from elisp to also publish it:
;;   (org-publish "morganwalsh.dev" t)
;; - t arg is optional, forces every file to re-export even if file has not changed


;; build files
;;(org-publish-all t)
(org-publish-project "org" t)


(message "Build complete")

