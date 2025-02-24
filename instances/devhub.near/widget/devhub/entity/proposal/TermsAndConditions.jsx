const code = `
<html>
   <head>
      <meta content="text/html; charset=UTF-8" http-equiv="content-type">
      <style type="text/css">@import url(https://themes.googleusercontent.com/fonts/css?kit=dpiI8CyVsrzWsJLBFKehGpLhv3qFjX7dUn1mYxfCXhI);
         ol.lst-kix_list_3-1 {
         list-style-type: none
         }
         ol.lst-kix_list_3-2 {
         list-style-type: none
         }
         .lst-kix_list_3-1>li {
         counter-increment: lst-ctn-kix_list_3-1
         }
         ol.lst-kix_list_3-3 {
         list-style-type: none
         }
         ol.lst-kix_list_3-4.start {
         counter-reset: lst-ctn-kix_list_3-4 0
         }
         ol.lst-kix_list_3-4 {
         list-style-type: none
         }
         .lst-kix_list_2-1>li {
         counter-increment: lst-ctn-kix_list_2-1
         }
         ol.lst-kix_list_3-0 {
         list-style-type: none
         }
         .lst-kix_list_1-1>li {
         counter-increment: lst-ctn-kix_list_1-1
         }
         ol.lst-kix_list_2-6.start {
         counter-reset: lst-ctn-kix_list_2-6 0
         }
         .lst-kix_list_3-0>li:before {
         content: "" counter(lst-ctn-kix_list_3-0, lower-roman) ". ";
         }
         ol.lst-kix_list_3-1.start {
         counter-reset: lst-ctn-kix_list_3-1 0;
         }
         .lst-kix_list_3-1>li:before {
         content: "" counter(lst-ctn-kix_list_3-1, lower-latin) ". ";
         }
         .lst-kix_list_3-2>li:before {
         content: "" counter(lst-ctn-kix_list_3-2, lower-roman) ". ";
         }
         ol.lst-kix_list_1-8.start {
         counter-reset: lst-ctn-kix_list_1-8 0;
         }
         ol.lst-kix_list_2-3.start {
         counter-reset: lst-ctn-kix_list_2-3 0;
         }
         .lst-kix_list_3-5>li:before {
         content: "" counter(lst-ctn-kix_list_3-5, lower-roman) ". ";
         }
         .lst-kix_list_3-4>li:before {
         content: "" counter(lst-ctn-kix_list_3-4, lower-latin) ". ";
         }
         ol.lst-kix_list_1-5.start {
         counter-reset: lst-ctn-kix_list_1-5 0;
         }
         .lst-kix_list_3-3>li:before {
         content: "" counter(lst-ctn-kix_list_3-3, decimal) ". ";
         }
         ol.lst-kix_list_3-5 {
         list-style-type: none;
         }
         ol.lst-kix_list_3-6 {
         list-style-type: none;
         }
         ol.lst-kix_list_3-7 {
         list-style-type: none;
         }
         ol.lst-kix_list_3-8 {
         list-style-type: none;
         }
         .lst-kix_list_3-8>li:before {
         content: "" counter(lst-ctn-kix_list_3-8, lower-roman) ". ";
         }
         .lst-kix_list_2-0>li {
         counter-increment: lst-ctn-kix_list_2-0;
         }
         .lst-kix_list_2-3>li {
         counter-increment: lst-ctn-kix_list_2-3;
         }
         .lst-kix_list_3-6>li:before {
         content: "" counter(lst-ctn-kix_list_3-6, decimal) ". ";
         }
         .lst-kix_list_3-7>li:before {
         content: "" counter(lst-ctn-kix_list_3-7, lower-latin) ". ";
         }
         .lst-kix_list_1-2>li {
         counter-increment: lst-ctn-kix_list_1-2;
         }
         ol.lst-kix_list_3-7.start {
         counter-reset: lst-ctn-kix_list_3-7 0;
         }
         .lst-kix_list_3-2>li {
         counter-increment: lst-ctn-kix_list_3-2;
         }
         ol.lst-kix_list_2-2 {
         list-style-type: none;
         }
         ol.lst-kix_list_2-3 {
         list-style-type: none;
         }
         ol.lst-kix_list_2-4 {
         list-style-type: none;
         }
         ol.lst-kix_list_2-5 {
         list-style-type: none;
         }
         .lst-kix_list_1-4>li {
         counter-increment: lst-ctn-kix_list_1-4;
         }
         ol.lst-kix_list_2-0 {
         list-style-type: none;
         }
         ol.lst-kix_list_1-6.start {
         counter-reset: lst-ctn-kix_list_1-6 0;
         }
         ol.lst-kix_list_2-1 {
         list-style-type: none;
         }
         ol.lst-kix_list_3-3.start {
         counter-reset: lst-ctn-kix_list_3-3 0;
         }
         ol.lst-kix_list_2-6 {
         list-style-type: none;
         }
         ol.lst-kix_list_2-7 {
         list-style-type: none;
         }
         ol.lst-kix_list_2-8 {
         list-style-type: none;
         }
         ol.lst-kix_list_1-0.start {
         counter-reset: lst-ctn-kix_list_1-0 0
         }
         .lst-kix_list_3-0>li {
         counter-increment: lst-ctn-kix_list_3-0
         }
         .lst-kix_list_3-3>li {
         counter-increment: lst-ctn-kix_list_3-3
         }
         .lst-kix_list_3-6>li {
         counter-increment: lst-ctn-kix_list_3-6
         }
         .lst-kix_list_2-5>li {
         counter-increment: lst-ctn-kix_list_2-5
         }
         .lst-kix_list_2-8>li {
         counter-increment: lst-ctn-kix_list_2-8
         }
         ol.lst-kix_list_3-2.start {
         counter-reset: lst-ctn-kix_list_3-2 0
         }
         .lst-kix_list_2-2>li {
         counter-increment: lst-ctn-kix_list_2-2
         }
         ol.lst-kix_list_2-4.start {
         counter-reset: lst-ctn-kix_list_2-4 0
         }
         ol.lst-kix_list_1-3 {
         list-style-type: none
         }
         ol.lst-kix_list_1-4 {
         list-style-type: none
         }
         .lst-kix_list_2-6>li:before {
         content: "" counter(lst-ctn-kix_list_2-6, decimal) ". "
         }
         .lst-kix_list_2-7>li:before {
         content: "" counter(lst-ctn-kix_list_2-7, lower-latin) ". "
         }
         .lst-kix_list_2-7>li {
         counter-increment: lst-ctn-kix_list_2-7
         }
         .lst-kix_list_3-7>li {
         counter-increment: lst-ctn-kix_list_3-7
         }
         ol.lst-kix_list_1-5 {
         list-style-type: none
         }
         ol.lst-kix_list_1-6 {
         list-style-type: none
         }
         ol.lst-kix_list_1-0 {
         list-style-type: none
         }
         .lst-kix_list_2-4>li:before {
         content: "" counter(lst-ctn-kix_list_2-4, lower-latin) ". "
         }
         .lst-kix_list_2-5>li:before {
         content: "" counter(lst-ctn-kix_list_2-5, lower-roman) ". "
         }
         .lst-kix_list_2-8>li:before {
         content: "" counter(lst-ctn-kix_list_2-8, lower-roman) ". "
         }
         ol.lst-kix_list_1-1 {
         list-style-type: none
         }
         ol.lst-kix_list_1-2 {
         list-style-type: none
         }
         ol.lst-kix_list_3-0.start {
         counter-reset: lst-ctn-kix_list_3-0 0
         }
         ol.lst-kix_list_1-7 {
         list-style-type: none
         }
         .lst-kix_list_1-7>li {
         counter-increment: lst-ctn-kix_list_1-7
         }
         ol.lst-kix_list_1-8 {
         list-style-type: none
         }
         ol.lst-kix_list_3-8.start {
         counter-reset: lst-ctn-kix_list_3-8 0
         }
         ol.lst-kix_list_2-5.start {
         counter-reset: lst-ctn-kix_list_2-5 0
         }
         .lst-kix_list_2-6>li {
         counter-increment: lst-ctn-kix_list_2-6
         }
         .lst-kix_list_3-8>li {
         counter-increment: lst-ctn-kix_list_3-8
         }
         ol.lst-kix_list_1-7.start {
         counter-reset: lst-ctn-kix_list_1-7 0
         }
         ol.lst-kix_list_2-2.start {
         counter-reset: lst-ctn-kix_list_2-2 0
         }
         .lst-kix_list_1-5>li {
         counter-increment: lst-ctn-kix_list_1-5
         }
         .lst-kix_list_1-8>li {
         counter-increment: lst-ctn-kix_list_1-8
         }
         ol.lst-kix_list_1-4.start {
         counter-reset: lst-ctn-kix_list_1-4 0
         }
         .lst-kix_list_3-5>li {
         counter-increment: lst-ctn-kix_list_3-5
         }
         ol.lst-kix_list_1-1.start {
         counter-reset: lst-ctn-kix_list_1-1 0
         }
         .lst-kix_list_3-4>li {
         counter-increment: lst-ctn-kix_list_3-4
         }
         .lst-kix_list_2-4>li {
         counter-increment: lst-ctn-kix_list_2-4
         }
         ol.lst-kix_list_3-6.start {
         counter-reset: lst-ctn-kix_list_3-6 0
         }
         ol.lst-kix_list_1-3.start {
         counter-reset: lst-ctn-kix_list_1-3 0
         }
         ol.lst-kix_list_2-8.start {
         counter-reset: lst-ctn-kix_list_2-8 0
         }
         ol.lst-kix_list_1-2.start {
         counter-reset: lst-ctn-kix_list_1-2 0
         }
         .lst-kix_list_1-0>li:before {
         content: "" counter(lst-ctn-kix_list_1-0, decimal) ". "
         }
         .lst-kix_list_1-1>li:before {
         content: "" counter(lst-ctn-kix_list_1-0, decimal) "." counter(lst-ctn-kix_list_1-1, decimal) ". "
         }
         .lst-kix_list_1-2>li:before {
         content: "" counter(lst-ctn-kix_list_1-0, decimal) "." counter(lst-ctn-kix_list_1-1, decimal) "." counter(lst-ctn-kix_list_1-2, decimal) ". "
         }
         ol.lst-kix_list_2-0.start {
         counter-reset: lst-ctn-kix_list_2-0 0
         }
         .lst-kix_list_1-3>li:before {
         content: "" counter(lst-ctn-kix_list_1-0, decimal) "." counter(lst-ctn-kix_list_1-1, decimal) "." counter(lst-ctn-kix_list_1-2, decimal) "." counter(lst-ctn-kix_list_1-3, decimal) ". "
         }
         .lst-kix_list_1-4>li:before {
         content: "" counter(lst-ctn-kix_list_1-0, decimal) "." counter(lst-ctn-kix_list_1-1, decimal) "." counter(lst-ctn-kix_list_1-2, decimal) "." counter(lst-ctn-kix_list_1-3, decimal) "." counter(lst-ctn-kix_list_1-4, decimal) ". "
         }
         ol.lst-kix_list_3-5.start {
         counter-reset: lst-ctn-kix_list_3-5 0
         }
         .lst-kix_list_1-0>li {
         counter-increment: lst-ctn-kix_list_1-0
         }
         .lst-kix_list_1-6>li {
         counter-increment: lst-ctn-kix_list_1-6
         }
         .lst-kix_list_1-7>li:before {
         content: "" counter(lst-ctn-kix_list_1-0, decimal) "." counter(lst-ctn-kix_list_1-1, decimal) "." counter(lst-ctn-kix_list_1-2, decimal) "." counter(lst-ctn-kix_list_1-3, decimal) "." counter(lst-ctn-kix_list_1-4, decimal) "." counter(lst-ctn-kix_list_1-5, decimal) "." counter(lst-ctn-kix_list_1-6, decimal) "." counter(lst-ctn-kix_list_1-7, decimal) ". "
         }
         ol.lst-kix_list_2-7.start {
         counter-reset: lst-ctn-kix_list_2-7 0
         }
         .lst-kix_list_1-3>li {
         counter-increment: lst-ctn-kix_list_1-3
         }
         .lst-kix_list_1-5>li:before {
         content: "" counter(lst-ctn-kix_list_1-0, decimal) "." counter(lst-ctn-kix_list_1-1, decimal) "." counter(lst-ctn-kix_list_1-2, decimal) "." counter(lst-ctn-kix_list_1-3, decimal) "." counter(lst-ctn-kix_list_1-4, decimal) "." counter(lst-ctn-kix_list_1-5, decimal) ". "
         }
         .lst-kix_list_1-6>li:before {
         content: "" counter(lst-ctn-kix_list_1-0, decimal) "." counter(lst-ctn-kix_list_1-1, decimal) "." counter(lst-ctn-kix_list_1-2, decimal) "." counter(lst-ctn-kix_list_1-3, decimal) "." counter(lst-ctn-kix_list_1-4, decimal) "." counter(lst-ctn-kix_list_1-5, decimal) "." counter(lst-ctn-kix_list_1-6, decimal) ". "
         }
         li.li-bullet-0:before {
         margin-left: -18pt;
         white-space: nowrap;
         display: inline-block;
         min-width: 20pt;
         margin-right: 10px !important;
         }
         .lst-kix_list_2-0>li:before {
         content: "" counter(lst-ctn-kix_list_2-0, lower-roman) ". "
         }
         .lst-kix_list_2-1>li:before {
         content: "" counter(lst-ctn-kix_list_2-1, lower-latin) ". "
         }
         ol.lst-kix_list_2-1.start {
         counter-reset: lst-ctn-kix_list_2-1 0
         }
         .lst-kix_list_1-8>li:before {
         content: "" counter(lst-ctn-kix_list_1-0, decimal) "." counter(lst-ctn-kix_list_1-1, decimal) "." counter(lst-ctn-kix_list_1-2, decimal) "." counter(lst-ctn-kix_list_1-3, decimal) "." counter(lst-ctn-kix_list_1-4, decimal) "." counter(lst-ctn-kix_list_1-5, decimal) "." counter(lst-ctn-kix_list_1-6, decimal) "." counter(lst-ctn-kix_list_1-7, decimal) "." counter(lst-ctn-kix_list_1-8, decimal) ". "
         }
         .lst-kix_list_2-2>li:before {
         content: "" counter(lst-ctn-kix_list_2-2, lower-roman) ". "
         }
         .lst-kix_list_2-3>li:before {
         content: "" counter(lst-ctn-kix_list_2-3, decimal) ". "
         }
         ol {
         margin: 0;
         padding: 0
         }
         table td,
         table th {
         padding: 0
         }
         .c20 {
         border-right-style: solid;
         padding: 5pt 5pt 5pt 5pt;
         border-bottom-color: #ffffff;
         border-top-width: 1pt;
         border-right-width: 1pt;
         border-left-color: #ffffff;
         vertical-align: top;
         border-right-color: #ffffff;
         border-left-width: 1pt;
         border-top-style: solid;
         border-left-style: solid;
         border-bottom-width: 1pt;
         width: 330.8pt;
         border-top-color: #ffffff;
         border-bottom-style: solid
         }
         .c3 {
         border-right-style: solid;
         padding: 5pt 5pt 5pt 5pt;
         border-bottom-color: #ffffff;
         border-top-width: 1pt;
         border-right-width: 1pt;
         border-left-color: #ffffff;
         vertical-align: top;
         border-right-color: #ffffff;
         border-left-width: 1pt;
         border-top-style: solid;
         border-left-style: solid;
         border-bottom-width: 1pt;
         width: 124.5pt;
         border-top-color: #ffffff;
         border-bottom-style: solid
         }
         .c18 {
         margin-left: 144pt;
         padding-top: 10pt;
         padding-left: 0pt;
         padding-bottom: 10pt;
         line-height: 1.1500000000000001;
         page-break-after: avoid;
         orphans: 2;
         widows: 2;
         text-align: justify
         }
         .c14 {
         margin-left: 108pt;
         padding-top: 10pt;
         padding-left: 0pt;
         padding-bottom: 10pt;
         line-height: 1.1500000000000001;
         orphans: 2;
         widows: 2;
         text-align: justify
         }
         .c16 {
         margin-left: 36pt;
         padding-top: 0pt;
         padding-left: 0pt;
         padding-bottom: 10pt;
         line-height: 1.2;
         orphans: 2;
         widows: 2;
         text-align: justify
         }
         .c1 {
         margin-left: 36pt;
         padding-top: 10pt;
         padding-left: 0pt;
         padding-bottom: 0pt;
         line-height: 1.2;
         orphans: 2;
         widows: 2;
         text-align: justify
         }
         .c11 {
         margin-left: 72pt;
         padding-top: 10pt;
         padding-left: 0pt;
         padding-bottom: 10pt;
         line-height: 1.1500000000000001;
         orphans: 2;
         widows: 2;
         text-align: justify
         }
         .c51 {
         color: #000000;
         font-weight: 400;
         text-decoration: none;
         vertical-align: baseline;
         font-size: 8pt;
         font-family: "Arial";
         font-style: normal
         }
         .c49 {
         padding-top: 10pt;
         text-indent: -18pt;
         padding-bottom: 0pt;
         line-height: 1.1500000000000001;
         orphans: 2;
         widows: 2;
         text-align: center
         }
         .c40 {
         margin-left: 76.5pt;
         padding-top: 0pt;
         padding-bottom: 10pt;
         line-height: 1.1500000000000001;
         orphans: 2;
         widows: 2;
         text-align: justify
         }
         .c27 {
         margin-left: 72pt;
         padding-top: 0pt;
         padding-bottom: 10pt;
         line-height: 1.1500000000000001;
         orphans: 2;
         widows: 2;
         text-align: justify
         }
         .c8 {
         margin-left: 36pt;
         padding-top: 10pt;
         padding-bottom: 10pt;
         line-height: 1.1500000000000001;
         orphans: 2;
         widows: 2;
         text-align: justify
         }
         .c45 {
         margin-left: 72pt;
         padding-top: 10pt;
         padding-bottom: 0pt;
         line-height: 1.2;
         orphans: 2;
         widows: 2;
         text-align: justify
         }
         .c0 {
         color: #000000;
         font-weight: 400;
         text-decoration: none;
         vertical-align: baseline;
         font-size: 11pt;
         font-family: "Roboto";
         font-style: normal
         }
         .c9 {
         color: #000000;
         font-weight: 400;
         text-decoration: none;
         vertical-align: baseline;
         font-size: 11pt;
         font-family: "Arial";
         font-style: normal
         }
         .c10 {
         color: #000000;
         font-weight: 700;
         text-decoration: none;
         vertical-align: baseline;
         font-size: 11pt;
         font-family: "Arial";
         font-style: normal
         }
         .c36 {
         padding-top: 0pt;
         padding-bottom: 0pt;
         line-height: 1.1500000000000001;
         orphans: 2;
         widows: 2;
         text-align: right;
         height: 11pt
         }
         .c44 {
         padding-top: 10pt;
         padding-bottom: 6pt;
         line-height: 1.1500000000000001;
         orphans: 2;
         widows: 2;
         text-align: justify
         }
         .c35 {
         padding-top: 0pt;
         padding-bottom: 0pt;
         line-height: 1.0;
         orphans: 2;
         widows: 2;
         text-align: justify
         }
         .c30 {
         padding-top: 10pt;
         padding-bottom: 0pt;
         line-height: 1.1500000000000001;
         orphans: 2;
         widows: 2;
         text-align: left
         }
         .c26 {
         padding-top: 0pt;
         padding-bottom: 4pt;
         line-height: 1.2;
         orphans: 2;
         widows: 2;
         text-align: justify
         }
         .c19 {
         padding-top: 10pt;
         padding-bottom: 10pt;
         line-height: 1.1500000000000001;
         orphans: 2;
         widows: 2;
         text-align: justify
         }
         .c50 {
         padding-top: 0pt;
         padding-bottom: 0pt;
         line-height: 1.1500000000000001;
         orphans: 2;
         widows: 2;
         text-align: justify
         }
         .c47 {
         padding-top: 0pt;
         padding-bottom: 10pt;
         line-height: 1.1500000000000001;
         orphans: 2;
         widows: 2;
         text-align: justify
         }
         .c2 {
         padding-top: 10pt;
         padding-bottom: 0pt;
         line-height: 1.1500000000000001;
         orphans: 2;
         widows: 2;
         text-align: justify
         }
         .c29 {
         padding-top: 0pt;
         padding-bottom: 10pt;
         line-height: 1.1500000000000001;
         orphans: 2;
         widows: 2;
         text-align: left
         }
         .c33 {
         padding-top: 0pt;
         padding-bottom: 0pt;
         line-height: 1.0;
         orphans: 2;
         widows: 2;
         text-align: left
         }
         .c34 {
         color: #000000;
         text-decoration: none;
         vertical-align: baseline;
         font-size: 15pt;
         font-style: normal
         }
         .c15 {
         color: #000000;
         text-decoration: none;
         vertical-align: baseline;
         font-size: 11pt;
         font-style: normal
         }
         .c38 {
         width: 100%;
         margin-left: 3pt;
         border-spacing: 0;
         border-collapse: collapse;
         margin-right: auto
         }
         .c22 {
         text-decoration-skip-ink: none;
         -webkit-text-decoration-skip: none;
         color: #1155cc;
         text-decoration: underline
         }
         .c42 {
         padding-top: 0pt;
         padding-bottom: 0pt;
         line-height: 1.0;
         text-align: justify
         }
         .c6 {
         padding-top: 10pt;
         padding-bottom: 0pt;
         line-height: 1.1500000000000001;
         text-align: justify
         }
         .c48 {
         text-decoration-skip-ink: none;
         -webkit-text-decoration-skip: none;
         text-decoration: underline
         }
         .c21 {
         padding-left: 0pt;
         page-break-after: avoid
         }
         .c23 {
         margin-left: 144pt;
         padding-left: 0pt
         }
         .c43 {
         color: inherit;
         text-decoration: inherit
         }
         .c5 {
         font-weight: 700;
         font-family: "Roboto"
         }
         .c7 {
         font-weight: 400;
         font-family: "Roboto"
         }
         .c17 {
         margin-left: 36pt;
         padding-left: 0pt
         }
         .c4 {
         padding: 0;
         margin: 0
         }
         .c25 {
         margin-left: 72pt;
         padding-left: 0pt
         }
         .c32 {
         margin-left: 36pt
         }
         .c46 {
         margin-left: 72pt
         }
         .c13 {
         height: 0pt
         }
         .c41 {
         font-style: italic
         }
         .c31 {
         font-size: 11pt
         }
         .c39 {
         height: 11pt
         }
         .c12 {
         height: 69.3pt
         }
         .c28 {
         padding-left: 0pt
         }
         .c24 {
         page-break-after: avoid
         }
         .title {
         padding-top: 0pt;
         color: #000000;
         font-size: 26pt;
         padding-bottom: 3pt;
         font-family: "Arial";
         line-height: 1.1500000000000001;
         page-break-after: avoid;
         orphans: 2;
         widows: 2;
         text-align: left
         }
         .subtitle {
         padding-top: 0pt;
         color: #666666;
         font-size: 15pt;
         padding-bottom: 16pt;
         font-family: "Arial";
         line-height: 1.1500000000000001;
         page-break-after: avoid;
         orphans: 2;
         widows: 2;
         text-align: left
         }
         li {
         color: #000000;
         font-size: 11pt;
         font-family: "Arial"
         }
         p {
         margin: 0;
         color: #000000;
         font-size: 11pt;
         font-family: "Arial"
         }
         h1 {
         padding-top: 10pt;
         color: #000000;
         font-weight: 700;
         font-size: 11pt;
         padding-bottom: 10pt;
         font-family: "Arial";
         line-height: 1.1500000000000001;
         page-break-after: avoid;
         orphans: 2;
         widows: 2;
         text-align: justify
         }
         h2 {
         padding-top: 18pt;
         color: #000000;
         font-size: 16pt;
         padding-bottom: 6pt;
         font-family: "Arial";
         line-height: 1.1500000000000001;
         page-break-after: avoid;
         orphans: 2;
         widows: 2;
         text-align: left
         }
         h3 {
         padding-top: 16pt;
         color: #434343;
         font-size: 14pt;
         padding-bottom: 4pt;
         font-family: "Arial";
         line-height: 1.1500000000000001;
         page-break-after: avoid;
         orphans: 2;
         widows: 2;
         text-align: left
         }
         h4 {
         padding-top: 14pt;
         color: #666666;
         font-size: 12pt;
         padding-bottom: 4pt;
         font-family: "Arial";
         line-height: 1.1500000000000001;
         page-break-after: avoid;
         orphans: 2;
         widows: 2;
         text-align: left
         }
         h5 {
         padding-top: 12pt;
         color: #666666;
         font-size: 11pt;
         padding-bottom: 4pt;
         font-family: "Arial";
         line-height: 1.1500000000000001;
         page-break-after: avoid;
         orphans: 2;
         widows: 2;
         text-align: left
         }
         h6 {
         padding-top: 12pt;
         color: #666666;
         font-size: 11pt;
         padding-bottom: 4pt;
         font-family: "Arial";
         line-height: 1.1500000000000001;
         page-break-after: avoid;
         font-style: italic;
         orphans: 2;
         widows: 2;
         text-align: left
         }
         ol.receipient {
         counter-reset: lst-ctn-kix_list_1-1 0;  !important;
         }
         ol.tokens{
         counter-reset: lst-ctn-kix_list_1-1 1;  !important;
         }
         ol.intellectual {
         counter-reset: lst-ctn-kix_list_1-1 3 lst-ctn-kix_list_1-2 0 !important;
         }
      </style>
   </head>
   <body class="c37 doc-content">
      <div>
         <p class="c33 c39"><span class="c9"></span></p>
      </div>
      <h1 class="c32 c49" id="h.gjdgxs"><span class="c5 c34">NEAR Foundation Grant Program<br>Terms and Conditions</span></h1>
      <p class="c19"><span class="c0">Last updated: 21 February 2025 </span></p>
      <p class="c2"><span class="c7">These terms and conditions are entered into by and between you (&ldquo;</span><span class="c5">Recipient</span><span class="c7">&rdquo; or &ldquo;</span><span class="c5">you</span><span class="c7">&rdquo; or &ldquo;</span><span class="c5">your</span><span class="c7">&rdquo;) and NEAR Foundation (&ldquo;</span><span class="c5">Foundation</span><span class="c7">&rdquo;, &ldquo;</span><span class="c5">we</span><span class="c7">&rdquo; or &ldquo;</span><span class="c5">us</span><span class="c7">&rdquo;). Please read these terms and conditions (&ldquo;</span><span class="c5">Terms</span><span class="c7">&rdquo;) carefully before submitting your Proposal to the Relevant Community (as defined below) under the Foundation&rsquo;s Grant Program (&ldquo;</span><span class="c5">Grant</span><span class="c0">&rdquo;). By proceeding with the submission of your Proposal you are accepting to be bound by these Terms. These Terms, together with any documents they expressly incorporate by reference, govern your receipt and use of the Grant. </span></p>
      <ol class="c4 lst-kix_list_1-0 start" start="1">
         <li class="c8 c21 li-bullet-0">
            <h1 id="h.1fob9te" style="display:inline"><span class="c15 c5">Introduction</span></h1>
         </li>
      </ol>
      <p class="c19"><span class="c7">The Foundation promotes the growth of the NEAR community and its associate ecosystem, and offers grants to support the community in helping further these goals. The Grant shall be used according to the approved Proposal, to further the development of the NEAR Protocol and its associated Ecosystem (as defined below) (&ldquo;</span><span class="c5">Purpose</span><span class="c0">&rdquo;). The Foundation provides the Grant under these Terms and the Grant shall be used exclusively for the Purpose. </span></p>
      <p class="c19"><span class="c0">The Foundation reserves the right to modify, amend and cancel the Grant Programme at any time at its absolute discretion.</span></p>
      <ol class="c4 lst-kix_list_1-0" start="2">
         <li class="c8 c21 li-bullet-0">
            <h1 id="h.3znysh7" style="display:inline"><span class="c15 c5">Defined Terms</span></h1>
         </li>
      </ol>
      <ol class="c4 lst-kix_list_1-1 start" start="1">
         <li class="c2 c25 li-bullet-0"><span class="c0">In these Terms, the following definitions will apply:</span></li>
      </ol>
      <table class="c38">
         <tr class="c12">
            <td class="c3" colspan="1" rowspan="1">
               <p class="c2"><span class="c15 c5">Achievement</span></p>
            </td>
            <td class="c20" colspan="1" rowspan="1">
               <p class="c2"><span class="c7">achievement of the Purpose to the satisfaction of the Foundation and/or the Relevant Community (and &ldquo;</span><span class="c5">Achieved</span><span class="c0">&rdquo; shall be construed accordingly);</span></p>
            </td>
         </tr>
         <tr class="c12">
            <td class="c3" colspan="1" rowspan="1">
               <p class="c2"><span class="c15 c5">Affiliate</span></p>
            </td>
            <td class="c20" colspan="1" rowspan="1">
               <p class="c2"><span class="c0">in respect of a party any person who, directly or indirectly, controls, is controlled by, or is under common control with that party, and for these purposes &ldquo;control&rdquo; and &ldquo;controlling&rdquo; are defined as directly or indirectly possessing the power to direct or cause the direction of the management and policies of such a person, whether through ownership of voting interests, by contract or otherwise;</span></p>
            </td>
         </tr>
         <tr class="c13">
            <td class="c3" colspan="1" rowspan="1">
               <p class="c2"><span class="c15 c5">Applicable Laws</span></p>
            </td>
            <td class="c20" colspan="1" rowspan="1">
               <p class="c2"><span class="c0">all applicable laws (including securities laws), statutes, regulations and codes from time to time in force;</span></p>
            </td>
         </tr>
         <tr class="c13">
            <td class="c3" colspan="1" rowspan="1">
               <p class="c30"><span class="c15 c5">Applicable Data Protection Laws:</span></p>
            </td>
            <td class="c20" colspan="1" rowspan="1">
               <p class="c2"><span class="c7">all Applicable Laws relating to data processing, protection, &nbsp;and the privacy of individuals, including the UK GDPR (as defined in section 3(10), as supplemented by section 205(4), of the UK&rsquo;s Data Protection Act 2018) and the EU GDPR (General Data Protection Regulation (EU) 2016/679));</span></p>
            </td>
         </tr>
         <tr class="c13">
            <td class="c3" colspan="1" rowspan="1">
               <p class="c2"><span class="c5">Business Day</span></p>
            </td>
            <td class="c20" colspan="1" rowspan="1">
               <p class="c2"><span class="c0">a day, other than a Saturday, Sunday or public holiday in Switzerland, when banks are open for business;</span></p>
            </td>
         </tr>
         <tr class="c13">
            <td class="c3" colspan="1" rowspan="1">
               <p class="c2"><span class="c15 c5">Business Hours</span></p>
            </td>
            <td class="c20" colspan="1" rowspan="1">
               <p class="c2"><span class="c0">the period from 9.00 am to 5.00 pm on any Business Day;</span></p>
            </td>
         </tr>
         <tr class="c13">
            <td class="c3" colspan="1" rowspan="1">
               <p class="c29"><span class="c10">Chain Signatures</span></p>
            </td>
            <td class="c20" colspan="1" rowspan="1">
               <p class="c29"><span class="c9">means the multi-party computation (MPC) network that enables<br>accounts on the NEAR Protocol, including smart contracts, to sign and execute transactions on other blockchains, known as &ldquo;Chain Signatures&rdquo;;</span></p>
            </td>
         </tr>
         <tr class="c13">
            <td class="c3" colspan="1" rowspan="1">
               <p class="c2"><span class="c15 c5">Change of Control</span></p>
            </td>
            <td class="c20" colspan="1" rowspan="1">
               <p class="c2"><span class="c7">where a person or entity who Controls any body corporate ceases to do so or if another person or entity acquires Control of it. For these purposes, &ldquo;</span><span class="c5">Control</span><span class="c0">&rdquo; means in relation to a body corporate, the power of a person or entity to secure that the affairs of the body corporate are conducted in accordance with the wishes of that person or entity:</span></p>
               <p class="c2"><span class="c0">by means of the holding of shares, or the possession of voting power, in or in relation to that or any other body corporate; or</span></p>
               <p class="c2"><span class="c0">as a result of any powers conferred by the constitution, articles of association or any other document regulating that or any other body corporate;</span></p>
            </td>
         </tr>
         <tr class="c13">
            <td class="c3" colspan="1" rowspan="1">
               <p class="c2"><span class="c5">Confidential Information</span></p>
            </td>
            <td class="c20" colspan="1" rowspan="1">
               <p class="c2"><span class="c7">means all information of a confidential and proprietary nature, whether created before or after the date of these Terms, which the disclosing Party (&ldquo;</span><span class="c5">Disclosing Party</span><span class="c7 c41">&rdquo;</span><span class="c7">) or its representatives directly or indirectly discloses, or makes available, to the receiving Party (&ldquo;</span><span class="c5">Receiving Party</span><span class="c7 c41">&rdquo;</span><span class="c0">) or its representatives or any of its Affiliates, or their Representatives before, on or after the date of these Terms, including:</span></p>
               <ol class="c4 lst-kix_list_2-0 start" start="1">
                  <li class="c2 c17 li-bullet-0"><span class="c0">all business, financial, technical, operational, commercial, employee, management and other information, data, experience and expertise of whatever kind (including information relating to trade secrets, know-how, designs, software (both source code and object code), intellectual property rights, inventions, patents, technology, operations, processes, plans, intentions, product information and development, marketing knowledge, marketing opportunities and sales information, business plans and dealings, financial information, forecasts, budgets, and plans, historic and current and future transactions, affairs and/or business) of the Disclosing Party; and</span></li>
                  <li class="c2 c17 li-bullet-0"><span class="c0">information derived from information falling within paragraph (i) above including analyses, compilations, studies and other documents prepared by any Party to these Terms or on their behalf which contain or otherwise reflect or are generated from the information specified in paragraph (ii);</span></li>
               </ol>
               <p class="c2 c32"><span class="c0">but not including information which:</span></p>
               <ol class="c4 lst-kix_list_3-0 start" start="1">
                  <li class="c2 c17 li-bullet-0"><span class="c0">is in the public domain at the time of disclosure or which subsequently comes into the public domain through no breach of these Terms by the Receiving Party;</span></li>
                  <li class="c2 c17 li-bullet-0"><span class="c0">was already lawfully in the possession of the Receiving Party prior to its disclosure by the Disclosing Party;</span></li>
                  <li class="c2 c17 li-bullet-0"><span class="c0">is subsequently disclosed to the Receiving Party by a third Party who, to the Receiving Party&rsquo;s knowledge, did not breach any confidentiality obligations in respect of the information and/or from someone owing a duty of confidence to the Disclosing Party; or</span></li>
                  <li class="c2 c17 li-bullet-0"><span class="c0">the Parties have agreed in writing that it is not confidential.</span></li>
               </ol>
            </td>
         </tr>
         <tr class="c13">
            <td class="c3" colspan="1" rowspan="1">
               <p class="c30"><span class="c15 c5">Devhub Payment Proposal</span></p>
            </td>
            <td class="c20" colspan="1" rowspan="1">
               <p class="c2"><span class="c0">as defined in clause 3.5;</span></p>
            </td>
         </tr>
         <tr class="c13">
            <td class="c3" colspan="1" rowspan="1">
               <p class="c2"><span class="c15 c5">Grant</span></p>
            </td>
            <td class="c20" colspan="1" rowspan="1">
               <p class="c2"><span class="c0">the grant given by the Foundation to you pursuant to, and in accordance with these Terms, following Proposal approval by the Relevant Community;</span></p>
            </td>
         </tr>
         <tr class="c13">
            <td class="c3" colspan="1" rowspan="1">
               <p class="c30"><span class="c5">Intellectual Property Rights</span></p>
            </td>
            <td class="c20" colspan="1" rowspan="1">
               <p class="c2"><span class="c0">patent rights (including patent applications and disclosures), copyrights, trademarks, trade secret rights, business names and domain names, goodwill and the right to sue for passing off, rights in designs, rights in computer software, database rights, rights to use, and protect the confidentiality of, confidential information (including know-how and trade secrets) and all other intellectual property rights, in each case whether registered or unregistered and including all applications and rights to apply for and be granted, renewals or extensions of, and rights to claim priority from, such rights and all similar or equivalent rights or forms of protection which subsist or will subsist now or in the future in any part of the world;</span></p>
            </td>
         </tr>
         <tr class="c13">
            <td class="c3" colspan="1" rowspan="1">
               <p class="c2"><span class="c15 c5">NEAR Ecosystem</span></p>
            </td>
            <td class="c20" colspan="1" rowspan="1">
               <p class="c2"><span class="c0">the NEAR Technology&rsquo;s ecosystem, comprised of the projects and applications that have been or are being developed and/or built on, or are running on, the NEAR Technology and their respective communities, contributors and developers;</span></p>
            </td>
         </tr>
         <tr class="c13">
            <td class="c3" colspan="1" rowspan="1">
               <p class="c33"><span class="c5">NEAR Intents</span></p>
            </td>
            <td class="c20" colspan="1" rowspan="1">
               <p class="c35"><span class="c7">the decentralised universal settlement protocol using JSON-structured requests processed by competing and compatible solvers to execute cross-chain and off-chain interactions and transactions leveraging one or more component(s) of the NEAR Technology, enabling AI-driven automation (where necessary and relevant) and seamless actions (including, but not limited to, asset transfers) across multiple blockchains, known as at the Effective Date as &ldquo;NEAR Intents&rdquo;;</span></p>
            </td>
         </tr>
         <tr class="c13">
            <td class="c3" colspan="1" rowspan="1">
               <p class="c33"><span class="c5">NEAR Protocol</span></p>
            </td>
            <td class="c20" colspan="1" rowspan="1">
               <p class="c35"><span class="c7">the sharded, developer-friendly, proof-of-stake, layer one blockchain, known as &ldquo;NEAR Protocol;</span></p>
            </td>
         </tr>
         <tr class="c13">
            <td class="c3" colspan="1" rowspan="1">
               <p class="c33"><span class="c5">NEAR Technology</span></p>
            </td>
            <td class="c20" colspan="1" rowspan="1">
               <p class="c35"><span class="c7">NEAR Protocol, NEAR Intents, Chain Signatures, and the OmniBridge;</span></p>
            </td>
         </tr>
         <tr class="c13">
            <td class="c3" colspan="1" rowspan="1">
               <p class="c6"><span class="c15 c5">NEAR Tokens</span></p>
            </td>
            <td class="c20" colspan="1" rowspan="1">
               <p class="c6"><span class="c0">the native cryptographic currency of the NEAR Protocol;</span></p>
            </td>
         </tr>
         <tr class="c13">
            <td class="c3" colspan="1" rowspan="1">
               <p class="c42"><span class="c10">OmniBridge</span></p>
            </td>
            <td class="c20" colspan="1" rowspan="1">
               <p class="c42"><span class="c9">the multi-chain asset bridge that facilitates secure and efficient transfers of Tokens between different blockchains by leveraging Chain Signatures, known as the &ldquo;OmniBridge&rdquo; as at the Effective Date;</span></p>
            </td>
         </tr>
         <tr class="c13">
            <td class="c3" colspan="1" rowspan="1">
               <p class="c6"><span class="c15 c5">Proposal</span></p>
            </td>
            <td class="c20" colspan="1" rowspan="1">
               <p class="c6"><span class="c0">Funding proposals submitted to the Relevant Community by members of the NEAR ecosystem for products and/or services connected to the Purpose. Relevant Community and/or Supervisor&rsquo;s approval of the Proposal is a condition of the Grant;</span></p>
            </td>
         </tr>
         <tr class="c13">
            <td class="c3" colspan="1" rowspan="1">
               <p class="c2"><span class="c15 c5">Relevant Community</span></p>
            </td>
            <td class="c20" colspan="1" rowspan="1">
               <p class="c2"><span class="c0">NEAR Ecosystem community responsible for the approval of the Proposal through the NEAR Ecosystem governance system. Communities are responsible for the approval of Proposals entitled to receive the Grants. For the purpose of these Terms, the term &lsquo;Relevant Communities&rsquo; here include but is not limited to DevHub, Events Committee and Education Committee; &nbsp;</span></p>
            </td>
         </tr>
         <tr class="c13">
            <td class="c3" colspan="1" rowspan="1">
               <p class="c2"><span class="c15 c5">Software</span></p>
            </td>
            <td class="c20" colspan="1" rowspan="1">
               <p class="c2"><span class="c0">any software (of whatever nature) created, developed and/or deployed of software in respect of achieving the Purpose;</span></p>
            </td>
         </tr>
         <tr class="c13">
            <td class="c3" colspan="1" rowspan="1">
               <p class="c6"><span class="c15 c5">Supervisors</span></p>
            </td>
            <td class="c20" colspan="1" rowspan="1">
               <p class="c2"><span class="c0">Any moderator or appointed representative of the Relevant Community responsible for reviewing, analyzing and/or approving the Proposals;</span></p>
            </td>
         </tr>
         <tr class="c13">
            <td class="c3" colspan="1" rowspan="1">
               <p class="c6"><span class="c5 c15">Token</span></p>
            </td>
            <td class="c20" colspan="1" rowspan="1">
               <p class="c2"><span class="c0">any cryptographical coin, token or currency, including (without limitation) USDC, USDT and the NEAR Token;</span></p>
            </td>
         </tr>
         <tr class="c13">
            <td class="c3" colspan="1" rowspan="1">
               <p class="c6"><span class="c15 c5">USDC</span></p>
            </td>
            <td class="c20" colspan="1" rowspan="1">
               <p class="c2"><span class="c0">USD Coin (USDC), the stablecoin pegged to the US Dollar and originally issued by Circle, native to the NEAR Protocol; and</span></p>
            </td>
         </tr>
         <tr class="c13">
            <td class="c3" colspan="1" rowspan="1">
               <p class="c6"><span class="c15 c5">USDT</span></p>
            </td>
            <td class="c20" colspan="1" rowspan="1">
               <p class="c2"><span class="c0">Tether (USDT), the stablecoin pegged to the US Dollar and originally issued by Tether, native to the NEAR Protocol.</span></p>
            </td>
         </tr>
      </table>
      <p class="c2 c39"><span class="c0"></span></p>
      <ol class="c4 lst-kix_list_1-0" start="3">
         <li class="c8 c21 li-bullet-0">
            <h1 id="h.2et92p0" style="display:inline"><span class="c15 c5">Grant Payment</span></h1>
         </li>
      </ol>
      <ol class="c4 lst-kix_list_1-1 start" start="1">
         <li class="c11 li-bullet-0"><span class="c0">The Grant will be disbursed in accordance with the Foundation&rsquo;s policies upon the acceptance of a Devhub Payment Proposal (defined below) by the Foundation and receipt of an invoice for the relevant amount. </span></li>
         <li class="c11 li-bullet-0"><span class="c0">You must use the Grant exclusively for the Purposes and in accordance with these Terms. Any deviation from the agreed-upon use of the Grant without prior written approval from the Foundation and the Relevant Community will constitute a breach of these Terms.</span></li>
         <li class="c11 li-bullet-0"><span class="c0">The Foundation reserves the right to request a detailed report on the use of the Grant funds. You are required to provide such a report within reasonable time. Failure by you to comply with the terms of the Grant payment, including but not limited to the misuse of funds or failure to provide required reports, may result in the suspension or termination of the Grant and the requirement to repay any disbursed funds.</span></li>
         <li class="c11 li-bullet-0"><span class="c7">The Foundation reserves the right to conduct due diligence in respect of you as it sees fit, which may include &ldquo;Know Your Client&rdquo; (KYC), &ldquo;Know Your Business&rdquo; (KYB), anti-money laundering (AML), and/or sanctions, checks (&ldquo;</span><span class="c5">Due Diligence</span><span class="c7">&rdquo;). The payment of a Devhub Payment Proposal &nbsp;is conditional on satisfactory completion of Due Diligence. You agree to cooperate with the Foundation in respect of Due Diligence.</span></li>
         <li class="c25 c44 li-bullet-0"><span class="c7">Grant payments denominated in USD, with payout currency NEAR, will be converted to NEAR based on the spot price at the time the payment proposal is created by the DevHub team in the NEAR Treasury Tool </span><span class="c7">(the &ldquo;Devhub Payment Proposal&rdquo;)</span><span class="c7">. The Foundation, at its sole discretion, aims to </span><span class="c7">pay outstanding DevHub Payment Proposals swiftly</span><span class="c0">&nbsp;however, the Recipient acknowledges and accepts that price fluctuations can and do occur and that the time at which the Devhub Payment Proposal is created in the NEAR Treasury Tool is the relevant time at which the currency conversion rate between USD and NEAR will apply. &nbsp;The Foundation will not be held liable for any fluctuations in the price of NEAR.</span></li>
         <li class="c11 li-bullet-0"><span class="c0">All costs relating to pursuing the Purpose will be borne by you.</span></li>
      </ol>
      <ol class="c4 tokens lst-kix_list_1-0" start="4">
         <li class="c8 c21 li-bullet-0">
            <h1 id="h.tyjcwt" style="display:inline"><span class="c15 c5">Tokens as Grant Payment</span></h1>
         </li>
      </ol>
      <ol class="c4 lst-kix_list_1-2 start" start="1">
         <li class="c14 li-bullet-0"><span class="c7">If any cryptographic tokens, e.g. USDT, USDC or $NEAR, (&ldquo;</span><span class="c5">Tokens</span><span class="c7">&rdquo;) are used for the Grant payment, the Foundation provides no representation, warranty or assurance regarding:</span></li>
      </ol>
      <ol class="c4 lst-kix_list_1-3 start" start="1">
         <li class="c19 c23 li-bullet-0"><span class="c7">the accuracy or completeness of information in any whitepaper or documentation related to the blockchain or protocol (whether NEAR Protocol or any other blockchain or protocol) on which the Tokens exist (&ldquo;</span><span class="c5">Relevant Protocol</span><span class="c7">&rdquo;);</span></li>
         <li class="c19 c23 li-bullet-0"><span class="c0">liabilities, obligations, value, utility, fungibility, or proprietary rights associated with the Tokens;</span></li>
         <li class="c19 c23 li-bullet-0"><span class="c0">Intellectual Property Rights in the Tokens;</span></li>
         <li class="c19 c23 li-bullet-0"><span class="c0">fitness of the Tokens or Relevant Protocol for a particular purpose;</span></li>
         <li class="c19 c23 li-bullet-0"><span class="c0">whether the Tokens are securities or regulated investments;</span></li>
         <li class="c19 c23 li-bullet-0"><span class="c0">compliance of the Token provision with Applicable Laws;</span></li>
         <li class="c19 c23 li-bullet-0"><span class="c0">success of the Relevant Protocol;</span></li>
      </ol>
      <ol class="c4 lst-kix_list_1-2" start="2">
         <li class="c14 li-bullet-0"><span class="c0">You acknowledge and warrant that:</span></li>
      </ol>
      <ol class="c4 lst-kix_list_1-3 start" start="1">
         <li class="c19 c23 li-bullet-0"><span class="c0">the Foundation is not liable for loss of funds or damages due to events outside its control or incorrect information provided by you;</span></li>
         <li class="c19 c23 li-bullet-0"><span class="c0">you understand the risks involved in the Relevant Protocol&#39;s development;</span></li>
         <li class="c19 c23 li-bullet-0"><span class="c0">you will receive the Tokens solely for your own benefit and account, not for speculation or expectation of profit;</span></li>
      </ol>
      <ol class="c4 lst-kix_list_1-2" start="3">
         <li class="c14 li-bullet-0"><span class="c0">NEAR Token Lock-Up and Vesting</span></li>
      </ol>
      <ol class="c4 lst-kix_list_1-3 start" start="1">
         <li class="c19 c23 li-bullet-0"><span class="c0">NEAR Tokens used for the Grant may be subject to a linear release Lock-Up, with technical restrictions on transferability. Any such restrictions will be confirmed to you ahead of any transfer of Tokens.</span></li>
      </ol>
      <ol class="c4 lst-kix_list_1-2" start="4">
         <li class="c14 li-bullet-0"><span class="c0">Wallet Address</span></li>
      </ol>
      <ol class="c4 lst-kix_list_1-3 start" start="1">
         <li class="c19 c23 li-bullet-0"><span class="c7">You are responsible for confirming the correct wallet address (&ldquo;</span><span class="c5">Wallet Address</span><span class="c7">&rdquo;), which must be accessible only through your private key. The Foundation bears no responsibility for Token loss due to an incorrect, inaccessible, or defective Wallet Address.</span></li>
      </ol>
      <ol class="c4 lst-kix_list_1-2" start="5">
         <li class="c14 li-bullet-0"><span class="c0">Payment Suspension</span></li>
      </ol>
      <ol class="c4 lst-kix_list_1-3 start" start="1">
         <li class="c19 c23 li-bullet-0"><span class="c0">The Foundation may suspend or withhold payments if the project is not progressing satisfactorily or if you violate these Terms.</span></li>
      </ol>
      <ol class="c4 lst-kix_list_1-0" start="5">
         <li class="c8 c21 li-bullet-0">
            <h1 id="h.3dy6vkm" style="display:inline"><span class="c15 c5">Recipient Obligations</span></h1>
         </li>
      </ol>
      <p class="c19"><span class="c0">&nbsp;In exchange for the Grant, you undertake that you will: </span></p>
      <ol class="c4 receipient lst-kix_list_1-1" start="1">
         <li class="c11 li-bullet-0"><span class="c0">use the Grant solely for the Purpose and for no other purpose;</span></li>
         <li class="c11 li-bullet-0"><span class="c0">perform your obligations under these Terms:</span></li>
      </ol>
      <ol class="c4 lst-kix_list_1-2 start" start="1">
         <li class="c14 li-bullet-0"><span class="c0">in accordance with all Applicable Laws;</span></li>
         <li class="c14 li-bullet-0"><span class="c0">using reasonable skill, care and diligence; and</span></li>
         <li class="c14 li-bullet-0"><span class="c0">in accordance with good industry practice as fitting for the development and operation of the Purpose;</span></li>
      </ol>
      <ol class="c4 lst-kix_list_1-1" start="9">
         <li class="c11 li-bullet-0"><span class="c0">use its best efforts to achieve the Purpose;</span></li>
         <li class="c11 li-bullet-0"><span class="c0">ensure that any Software &nbsp;free of defects in all material respects and comply with all Applicable Laws and any and all specifications and requirements set by the Foundation;</span></li>
         <li class="c11 li-bullet-0"><span class="c0">ensure that any underlying smart contract infrastructure is robustly audited and tested in accordance with best industry practice prior to its launch and, if and when appropriate, at regular intervals thereafter;</span></li>
         <li class="c11 li-bullet-0"><span class="c0">on behalf of third parties/by way of a business have no power to invest any of the Grant amount. No interest or other income may be generated from the Grant;</span></li>
         <li class="c11 li-bullet-0"><span class="c0">not materially alter the scope, features or direction (as applicable) of its business in relation to the Grant, without obtaining prior written approval from the Foundation;</span></li>
         <li class="c11 li-bullet-0"><span class="c0">cooperate with the Foundation in all matters relating to the Purpose, and the Grant, and comply with the Foundation&rsquo;s instructions;</span></li>
         <li class="c11 li-bullet-0"><span class="c0">at all times conduct your &nbsp;business, and activities, in connection with these Terms in the best interest of, with good faith with respect to, and in such a manner to promote a good image of and enhance public relations for, the Foundation, the NEAR Technology, and the NEAR Ecosystem;</span></li>
         <li class="c11 li-bullet-0"><span class="c0">not engage in any unfair or deceptive trade practice involving the Purpose, the Software, the Foundation, the NEAR Technology, the NEAR Token, or the NEAR Ecosystem;</span></li>
         <li class="c11 li-bullet-0"><span class="c0">not make any false, misleading, negative, prejudicial, or disparaging representations or statements about the Foundation, the NEAR Technology, the NEAR Token and/or the NEAR Ecosystem (in connection with the Grant or otherwise);</span></li>
         <li class="c11 li-bullet-0"><span class="c0">will not become involved in or become associated with (whether directly or indirectly) any situation or activity (whether caused by you or a third party) which tends, in the reasonable opinion of the Foundation, to have a negative effect on the reputation or standing of the Foundation (or any aspect of its activities), the NEAR Technology, the NEAR Token, or the NEAR Ecosystem;</span></li>
         <li class="c11 li-bullet-0"><span class="c0">where the Purpose involve software, you will provide to the Foundation t at a minimum read-only access to you&rsquo;s private codebase, if requested by the Foundation; </span></li>
         <li class="c11 li-bullet-0"><span class="c0">promptly notify the Foundation in writing if you are no longer actively pursuing the completion of the Purpose, and shall provide detailed reasons as part of such notification;</span></li>
         <li class="c11 li-bullet-0"><span class="c0">promptly notify the Foundation in writing if you intend to deviate from the agreed specifications of the the Purpose and shall provide detailed reasons and proposed alternatives as part of such notification;</span></li>
         <li class="c11 li-bullet-0"><span class="c7">regularly update the relevant Supervisor in writing (e.g. by email or via </span><span class="c7 c22"><a class="c43" href="https://www.google.com/url?q=https://near.social/devhub.near/widget/app?page%3Dhome&amp;sa=D&amp;source=editors&amp;ust=1740400423937646&amp;usg=AOvVaw2tXIkRUdnkZ9RB3HCxxDHd">https://near.social/devhub.near/widget/app?page=home</a></span><span class="c0">) on the progress of completion of the Purpose; </span></li>
         <li class="c11 li-bullet-0"><span class="c0">Maintain clear and regular communication with the relevant Supervisor on the progress of achieving the Purpose s and provide timely and accurate information to the relevant Supervisor; and</span></li>
         <li class="c11 li-bullet-0"><span class="c0">promptly provide written notice to the Foundation of any claims, investigations or proceedings, which, if determined adversely, could reasonably be expected to result in a material adverse effect on the ability of you to achieve the Purpose or perform any of the other obligations under these Terms.</span></li>
      </ol>
      <p class="c8"><span class="c0">Failure to comply with these obligations may result in the suspension or termination of your access to the Grant, at the sole discretion of the Foundation.</span></p>
      <ol class="c4 lst-kix_list_1-0" start="6">
         <li class="c8 c28 li-bullet-0"><span class="c5">Review of Achievement by the Foundation</span></li>
      </ol>
      <ol class="c4 lst-kix_list_1-1 start" start="1">
         <li class="c11 li-bullet-0"><span class="c0">The Foundation may conduct periodic reviews of the achievements by you in relation to the Grant provided under these Terms. The purpose of these reviews is to ensure that you are utilizing the Grant in accordance with the agreed terms and to assess the effectiveness of the Grant in achieving your objectives.</span></li>
         <li class="c11 li-bullet-0"><span class="c0">The review process shall include, but not be limited to, an evaluation of your compliance with these Terms, the quality and impact of the Grant utilized, and any feedback from you regarding the Grant. The Foundation reserves the right to modify, suspend, or terminate the Grant provided to you based on the outcome of these reviews.</span></li>
      </ol>
      <ol class="c4 lst-kix_list_1-0" start="7">
         <li class="c8 c21 li-bullet-0">
            <h1 id="h.1t3h5sf" style="display:inline"><span class="c15 c5">Marketing and Promotion</span></h1>
         </li>
      </ol>
      <ol class="c4 lst-kix_list_1-1 start" start="1">
         <li class="c11 c24 li-bullet-0"><span class="c7">You will not make, issue or encourage and other person or entity to make or issue, any press releases or similar public statement or announcements (including, without limitation, via social media, podcast, webinar, interview, Telegram, an app or other publicly accessible medium) in connection with the Grant, without the prior written approval of the Foundation (which will not be unreasonably withheld).</span><span class="c5">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></li>
         <li class="c11 li-bullet-0"><span class="c0">The Foundation may, but is not required to, make public any Grant under these Terms. Upon request by the Foundation, you will provide to the Foundation product descriptions, images, logos, website links and other content regarding the Grant as may be reasonably requested by the Foundation for inclusion in such publications.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></li>
         <li class="c11 li-bullet-0"><span class="c7">You agree to use best efforts to enable and procure the Foundation&rsquo;s participation in co-branding and co-marketing opportunities with the goal of increasing the awareness and usage of the NEAR Technology. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="c5">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></li>
      </ol>
      <ol class="c4 lst-kix_list_1-0" start="8">
         <li class="c8 c21 li-bullet-0">
            <h1 id="h.4d34og8" style="display:inline"><span class="c15 c5">Representations and Warranties</span></h1>
         </li>
      </ol>
      <ol class="c4 lst-kix_list_1-1 start" start="1">
         <li class="c11 c24 li-bullet-0"><span class="c0">You represent and warrant that </span></li>
      </ol>
      <ol class="c4 lst-kix_list_1-2 start" start="1">
         <li class="c14 c24 li-bullet-0"><span class="c0">each of the following statements is true and accurate and all of the information you provided was and shall remain true and complete;</span></li>
         <li class="c14 c24 li-bullet-0"><span class="c0">If you are applying for a Grant on behalf of a legal entity, such legal entity is duly organized and validly existing under the applicable laws of the jurisdiction of its organization and you are duly authorized by such legal entity to act on its behalf;</span></li>
         <li class="c14 c24 li-bullet-0"><span class="c0">you are of legal age to form a binding contract (at least 18 years old in most jurisdictions);</span></li>
         <li class="c14 c24 li-bullet-0"><span class="c0">you have the right, full power and authority to enter into these Terms to exercise your rights and perform your obligations under these Terms and in doing so will not violate any other agreement to which you are a Party nor any laws;</span></li>
         <li class="c14 c24 li-bullet-0"><span class="c0">these Terms constitutes a legal, valid and binding obligation on you which are enforceable against you in accordance with their terms;</span></li>
         <li class="c14 c24 li-bullet-0"><span class="c0">no consent, authorisation, license or approval of or notice to any governmental authority nor your shareholders, partners, members, other record or beneficial owners or other any relevant person (as applicable) is required to authorize the execution, delivery, validity, enforceability or admissibility in evidence of the performance by You of your obligations under these Terms;</span></li>
         <li class="c14 c24 li-bullet-0"><span class="c0">you are not a citizen of, or resident in or located in, or incorporated or otherwise a country:</span></li>
      </ol>
      <ol class="c4 lst-kix_list_1-3 start" start="1">
         <li class="c18 li-bullet-0"><span class="c7">listed on any of the following lists (each a &ldquo;</span><span class="c5">Sanctions List</span><span class="c7">&rdquo;): the Consolidated United Nations Security Council Sanctions List; the Specially Designated Nationals and Blocked Persons List or the Sectoral Sanctions Identification List maintained by the US Office of Foreign Assets Control (OFAC); the Consolidated List of Persons, Groups and Entities subject to EU Financial Sanctions; the Consolidated List of Financial Sanctions Targets or List of persons subject to restrictive measures in view of Russia&#39;s actions destabilizing the situation in Ukraine, maintained by the UK Treasury; the Overall List of Sanctioned Individuals, Entities and Organizations maintained by the Swiss State Secretariat for Economic Affairs (SECO); &#39;Ordinance lists of the Swiss Federal Council&#39;; or any similar list maintained by, or public announcement of sanctions made by, any other Sanctions Authority (as defined below);</span></li>
         <li class="c18 li-bullet-0"><span class="c0">owned or controlled by, or acting on behalf of or for the benefit of, any person on a Sanctions List;</span></li>
         <li class="c18 li-bullet-0"><span class="c0">located in, resident in or incorporated under the laws of (as applicable) Syria, Iran, Cuba, Russia or North Korea, Crimea, Donetsk and Luhansk, or any other country or territory which, after the Effective Date, becomes the target of such comprehensive, country-wide or territory-wide Sanctions (as defined below) as currently apply to the aforementioned territories; or</span></li>
         <li class="c18 li-bullet-0"><span class="c0">the target of any sanctions laws, regulations, embargoes or restrictive measures (Sanctions), as amended from time to time, administered, enacted or enforced by: the United Nations, the United States, the European Union or any Member State thereof, the United Kingdom, Switzerland or the respective Governmental Authorities and agencies of any of the foregoing responsible for administering, enacting or enforcing Sanctions, including without limitation, OFAC, the US Department of State, the United Kingdom Treasury or the SECO (Sanctions Authority).</span></li>
      </ol>
      <ol class="c4 lst-kix_list_1-2" start="8">
         <li class="c14 li-bullet-0"><span class="c0">the information that was submitted to the Foundation in connection with the &nbsp;Grant, and in any reports or communications delivered to the Foundation (including in respect of any Due Diligence), is accurate and complete; </span></li>
         <li class="c14 li-bullet-0"><span class="c0">your use of the Grant will comply with all applicable sanctions and the you will use best endeavors to prevent the use of any technology services provided by you and/or developed with the use of the Grant by sanctioned individuals and entities, including but not limited to the use of geo-blocking solutions. </span></li>
         <li class="c14 li-bullet-0"><span class="c0">any Software developed to achieve the Purpose will be free of material defects, bugs or vulnerabilities;</span></li>
         <li class="c14 c24 li-bullet-0"><span class="c0">you will comply with any laws applicable to your Software and not engage in any illegal activities. In particular, you will not use the NEAR Protocol to facilitate infringement of any third party intellectual property rights or data privacy rights;</span></li>
         <li class="c14 li-bullet-0"><span class="c0">no litigation, claim, arbitration, action, suit or administrative proceedings of any kind are taking place or pending, or to the best of your knowledge and belief (after due and careful enquiry), have been threatened against you; and</span></li>
         <li class="c14 li-bullet-0"><span class="c0">you have the technical ability and resources necessary to fulfill its obligations under these Terms and, in particular, in connection with the Purpose.</span></li>
      </ol>
      <ol class="c4 lst-kix_list_1-1" start="2">
         <li class="c11 c24 li-bullet-0"><span class="c0">You shall indemnify and hold harmless the Foundation from any third party claims (including reasonable attorney&#39;s costs) raised against the Foundation based on an alleged infringement of the above representations and warranties.</span></li>
         <li class="c11 li-bullet-0"><span class="c0">You are aware and confirm that the Foundation is relying on the above representations (which are material to the Foundation) and that if it were not for your representations and warranties in this Clause, the Foundation would not provide the Grant to you.</span></li>
         <li class="c11 li-bullet-0"><span class="c0">The Foundation does not provide any warranty that the Software will be compatible with the NEAR Technology or any related technology now or in the future.</span></li>
         <li class="c11 li-bullet-0"><span class="c0">The Foundation does not provide any warranty or representation (whether express or implied) of any kind in respect of the Grant, the Purpose or otherwise under or in connection with these Terms.</span></li>
      </ol>
      <ol class="c4 lst-kix_list_1-0" start="9">
         <li class="c8 c21 li-bullet-0">
            <h1 id="h.2s8eyo1" style="display:inline"><span class="c15 c5">Taxes and Other Duties</span></h1>
         </li>
      </ol>
      <ol class="c4 lst-kix_list_1-1 start" start="1">
         <li class="c11 li-bullet-0"><span class="c0">You are solely responsible for determining what, if any, taxes or other duties apply to the Grant. It is also your responsibility to withhold, collect, report, and remit the correct taxes to the appropriate tax authorities, according to the legislation in force. The Foundation is not responsible and shall be in no way held liable for withholding, collecting, reporting, and remitting and taxes arising from, or in connection to the Grant.</span></li>
         <li class="c11 li-bullet-0"><span class="c0">Neither party will have any right, power or authority to create any obligation, expressed or implied, on behalf of the other party in connection with these Terms.</span></li>
         <li class="c11 li-bullet-0"><span class="c0">The Foundation makes no representation or warranty that you will profit in any way or derive any benefit from these Terms. </span></li>
      </ol>
      <ol class="c4 lst-kix_list_1-0" start="10">
         <li class="c8 c21 li-bullet-0">
            <h1 id="h.17dp8vu" style="display:inline"><span class="c15 c5">Intellectual Property</span></h1>
         </li>
      </ol>
      <ol class="c4 lst-kix_list_1-1 start" start="1">
         <li class="c11 li-bullet-0"><span class="c7">Notwithstanding Clause 10.2, you own all existing and future rights, titles and interests in and to the logos, trade names, strap lines, trademarks or service marks (registered or unregistered), accompanying artwork, designs, slogans, texts and other collateral marketing signs &nbsp;as made available by you which are not open-source, to the Foundation from time to time, including all associated Intellectual Property Rights (&ldquo;</span><span class="c5">Recipient Marks</span><span class="c7">&rdquo;). In relation to these Recipient Marks, you grant to the Foundation a non-exclusive, worldwide, royalty-free, sublicensable right and license to use, reproduce, distribute, display, publish and transmit the Recipient Marks solely in connection with this Agreement, the Purpose, and the Foundation&rsquo;s business including, without limitation, for the advertisement, growth and promotion of the Foundation, the NEAR Technology and the NEAR Ecosystem, in any media formats, through any media channels or otherwise.</span></li>
         <li class="c11 li-bullet-0"><span class="c0">Nothing in this Agreement will be construed as a representation or agreement that the Foundation will not develop or have developed products, concepts, systems or techniques that are similar to or compete with any products, concepts, systems or techniques contemplated by or embodied in any materials or information provided by you (including its team members) to the Foundation in connection with this Agreement and/or the Grant.</span></li>
         <li class="c11 li-bullet-0"><span class="c7">The Foundation owns or has a license to use all existing and future rights, titles and interests in and to the logos, trade names, strap lines, trade or service marks (registered or unregistered), accompanying artwork, designs, slogans, texts and other collateral marketing signs of the Foundation or the NEAR Technology, including all associated Intellectual Property Rights (&ldquo;</span><span class="c5">NEAR Marks</span><span class="c7">&rdquo;). The Foundation grants to you the non-transferable and non-exclusive right to use the NEAR Marks as necessary for the purposes of this Agreement and until its termination, provided that you will strictly:</span></li>
      </ol>
      <ol class="c4 intellectual lst-kix_list_1-2 start" start="3">
         <li class="c14 li-bullet-0"><span class="c7">follow all brand guidelines provided by the Foundation, including (without limitation), the guidelines found at </span><span class="c7 c48"><a class="c43" href="https://www.google.com/url?q=https://near.org/brand/&amp;sa=D&amp;source=editors&amp;ust=1740400423941761&amp;usg=AOvVaw2KaPi4Pg3ctU_D22ys-hqc">https://near.org/brand/</a></span><span class="c0">. These guidelines may cover aspects such as logo usage, color schemes, typography, and more; and</span></li>
         <li class="c14 li-bullet-0"><span class="c0">collaborate with the Foundation to coordinate the use of the NEAR Marks in any promotional materials, events, or activities. It is mandatory for you to obtain written approval from the Foundation before using the NEAR Marks in any capacity.</span></li>
      </ol>
      <ol class="c4 lst-kix_list_1-0" start="11">
         <li class="c8 c21 li-bullet-0">
            <h1 id="h.3rdcrjn" style="display:inline"><span class="c15 c5">Indemnification</span></h1>
         </li>
      </ol>
      <ol class="c4 lst-kix_list_1-1 start" start="1">
         <li class="c11 li-bullet-0"><span class="c0">You will indemnify, defend and hold harmless the Foundation (and its directors, officers, employees, Affiliates, subsidiaries and agents) against any claims, actions proceedings, losses, damages, expenses and costs (including without limitation court costs and reasonable legal fees) arising out of or in connection with:</span></li>
      </ol>
      <ol class="c4 lst-kix_list_1-2 start" start="1">
         <li class="c14 li-bullet-0"><span class="c0">the making, acceptance or use of the Grant (and/or any other benefit you receive under this Agreement); </span></li>
         <li class="c14 li-bullet-0"><span class="c0">the pursuit by you of the Purpose; </span></li>
         <li class="c14 li-bullet-0"><span class="c0">any claim that the Purpose infringes the rights (including, without limitation, Intellectual Property Rights) of any third party; or</span></li>
         <li class="c14 li-bullet-0"><span class="c0">any breach by you of any provision of these Terms, provided that you are given reasonably prompt notice of any such claim.</span></li>
      </ol>
      <ol class="c4 lst-kix_list_1-0" start="12">
         <li class="c8 c21 li-bullet-0">
            <h1 id="h.26in1rg" style="display:inline"><span class="c15 c5">Liability</span></h1>
         </li>
      </ol>
      <p class="c19 c46"><span class="c0">You acknowledge and agree that, to the extent permissible by law, the Foundation will have no liability to you or any other NEAR Ecosystem participant for any liability howsoever arising (whether in tort (including for negligence) contract, misrepresentation (whether innocent or negligent), restitution or otherwise) in respect of the Purpose, the Software, the Grant, the NEAR Technology, or any action taken by the Foundation or you in connection with this Agreement.</span></p>
      <ol class="c4 lst-kix_list_1-0" start="13">
         <li class="c8 c21 li-bullet-0">
            <h1 id="h.lnxbz9" style="display:inline"><span class="c15 c5">Suspected Misuse of the Grant</span></h1>
         </li>
      </ol>
      <ol class="c4 lst-kix_list_1-1 start" start="1">
         <li class="c11 li-bullet-0"><span class="c0">Notwithstanding anything to the contrary elsewhere in these Terms, to the extent that the Foundation (acting reasonably) has a suspicion that some or all of the Grant is being used in a manner which (directly or indirectly) breaches any provision of these Terms, the Foundation will have the right to:</span></li>
      </ol>
      <ol class="c4 lst-kix_list_1-2 start" start="1">
         <li class="c14 li-bullet-0"><span class="c7">on prior written notice to you, suspend the provision of any further portions of the Grant (whether expressly due under these Terms or otherwise) (a &ldquo;</span><span class="c5">Suspension Notice</span><span class="c7">&rdquo;); and</span></li>
         <li class="c14 li-bullet-0"><span class="c7">require that within five days from receipt of the suspension notice, you provide all information and records which the Foundation may reasonably require in order to determine the deployment and use of the Grant by you (the &ldquo;</span><span class="c5">Grant Information</span><span class="c7">&rdquo;).&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></li>
      </ol>
      <ol class="c4 lst-kix_list_1-0" start="14">
         <li class="c17 c26 li-bullet-0">
            <h2 id="h.35nkun2" style="display:inline"><span class="c5 c31">Changes to these Terms </span></h2>
         </li>
      </ol>
      <p class="c45"><span class="c0">We may revise and update these Terms from time to time in our sole discretion. All changes are effective immediately when we publish them and apply to all Proposals submitted thereafter. Your continued submission of Proposals following the posting of revised Terms means that you accept and agree to the changes.</span></p>
      <ol class="c4 lst-kix_list_1-0" start="15">
         <li class="c1 li-bullet-0">
            <h2 id="h.1ksv4uv" style="display:inline"><span class="c5 c31">Governing Law and Jurisdiction</span></h2>
         </li>
      </ol>
      <ol class="c4 lst-kix_list_1-1 start" start="1">
         <li class="c25 c50 li-bullet-0"><span class="c0">All matters relating to these Terms, and any dispute or claim arising therefrom or related thereto (in each case, including non-contractual disputes or claims), shall be governed by and construed in accordance with the law of Switzerland.</span></li>
         <li class="c2 c25 li-bullet-0"><span class="c0">Any legal suit, action, or proceeding arising out of, or related to these Terms shall be instituted exclusively in the courts of Zug, although we retain the right to bring any suit, action, or proceeding against you for breach of these Terms in your country of residence or any other relevant country.</span></li>
         <li class="c11 li-bullet-0"><span class="c0">You waive any and all objections to the exercise of jurisdiction over you by such courts and to venue in such courts.</span></li>
      </ol>
      <ol class="c4 lst-kix_list_1-0" start="16">
         <li class="c16 li-bullet-0">
            <h2 id="h.44sinio" style="display:inline"><span class="c5 c31">Limitation on Time to File Claims</span></h2>
         </li>
      </ol>
      <p class="c27"><span class="c0">ANY CAUSE OF ACTION OR CLAIM YOU MAY HAVE ARISING OUT OF OR RELATING TO THESE TERMS MUST BE COMMENCED WITHIN ONE (1) YEAR AFTER THE CAUSE OF ACTION ACCRUES, OTHERWISE, SUCH CAUSE OF ACTION OR CLAIM IS PERMANENTLY BARRED.</span></p>
      <ol class="c4 lst-kix_list_1-0" start="17">
         <li class="c16 li-bullet-0">
            <h2 id="h.2jxsxqh" style="display:inline"><span class="c5 c31">Waiver and Severability</span></h2>
         </li>
      </ol>
      <ol class="c4 lst-kix_list_1-1 start" start="1">
         <li class="c27 c28 li-bullet-0"><span class="c0">No waiver by us of any term or condition set out in these Terms shall be deemed a further or continuing waiver of such term or condition or a waiver of any other term or condition, and any failure of us to assert a right or provision under these Terms shall not constitute a waiver of such right or provision.</span></li>
         <li class="c27 c28 li-bullet-0"><span class="c0">If any provision of these Terms is held by a court or other tribunal of competent jurisdiction to be invalid, illegal or unenforceable for any reason, such provision shall be eliminated or limited to the minimum extent such that the remaining provisions of the Terms will continue in full force and effect.</span></li>
      </ol>
      <ol class="c4 lst-kix_list_1-0" start="18">
         <li class="c16 li-bullet-0">
            <h2 id="h.z337ya" style="display:inline"><span class="c5 c31">Entire Agreement</span></h2>
         </li>
      </ol>
      <ol class="c4 lst-kix_list_1-1 start" start="1">
         <li class="c27 c28 li-bullet-0"><span class="c0">The Terms (including any terms expressly referred to herein, to the extent governing the relationship between you and the Foundation) constitute the sole and entire agreement between you and the Foundation regarding the Grant and supersede all prior and contemporaneous understandings, agreements, representations, and warranties, both written and oral, regarding the Grant.</span></li>
      </ol>
      <ol class="c4 lst-kix_list_1-0" start="19">
         <li class="c17 c47 li-bullet-0"><span class="c5">Contact</span></li>
      </ol>
      <p class="c40"><span class="c0">If you have any questions about these Terms please contact us via legal@near.foundation.</span></p>
      <p class="c2 c39"><span class="c0"></span></p>
      <div>
         <p class="c36"><span class="c51"></span></p>
      </div>
   </body>
</html>
`;

return (
  <iframe
    style={{
      width: "100%",
      height: "90vh",
    }}
    srcDoc={code}
  />
);
