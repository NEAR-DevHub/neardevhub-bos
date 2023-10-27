return (
  <iframe
    iframeResizer
    srcDoc={`
      <div id="mc_embed_shell">
        <link href="//cdn-images.mailchimp.com/embedcode/classic-061523.css" rel="stylesheet" type="text/css">
        <style type="text/css">
          body {
            margin: 0;
          }
          .container {
            max-width: 720px;
            margin: 0 auto;
          }
          .heading {
            color: #151515;
            text-align: center;
            font-size: 36px;
            font-style: normal;
            font-weight: 700;
            line-height: 120%; /* 43.2px */
          }
          .lead {
            color: #151515;
            text-align: center;
            font-size: 24px;
            font-style: normal;
            font-weight: 400;
            line-height: 120%; /* 28.8px */
            letter-spacing: -0.72px;

            margin: 0 auto;
          }
          #mc_embed_signup {
              background: #00EC97;
              clear: left; 
              font: 14px Helvetica, Arial, sans-serif; 
              padding: 20px;
              text-align: center;
          }
          #mc_embed_signup h2 {
              font-size: 24px;
              margin-bottom: 20px;
          }
          #mc-embedded-subscribe {
            width: 160px;
            height: 60px;
            flex-shrink: 0;
            background: #151515;
            color: #00EC97;
            font-size: 1.125rem;
            font-style: normal;
            font-weight: 700;
            line-height: 20px; /* 83.333% */
            cursor: pointer;
            margin: 0 !important;

            @media screen and (max-width: 768px) {
                width: 96%;
            }
          }
          #mce-responses {
            display: none !important;
          }
          .form-group {
            display: flex !important;

            @media screen and (max-width: 768px) {
                flex-direction: column;
            }
          }
          .mc-field-group {
            padding: 0 !important;
          }

          .social-links {
            display: flex;
            gap: 1rem;
            align-items: center;
            justify-content: center;
          }

          .social-link {
            text-decoration: none;
          }

          .social-link:hover {
            text-decoration: none;
          }
        </style>
        <div id="mc_embed_signup">
          <div class="container">
            <h2 class="heading">/dev/hub newsletter</h2>
            <p class="lead">Stay in the loop. Get the latest updates, announcements, opportunities, and insights from the ecosystem in your inbox</p>
            <form action="https://gmail.us13.list-manage.com/subscribe/post?u=a52895422d000733a8dedc526&amp;id=5addef27c3&amp;f_id=00aa37e2f0" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate form-group" target="_blank">
                <div class="mc-field-group">
                    <input type="email" name="EMAIL" placeholder="Type your email..." class="required email" id="mce-EMAIL" required="" value="">
                </div>
                <div id="mce-responses" class="clear foot">
                <div class="response" id="mce-error-response" style="display: none;"></div>
                <div class="response" id="mce-success-response" style="display: none;"></div>
                </div>
                <div aria-hidden="true" style="position: absolute; left: -5000px;">
                    <input type="text" name="b_a52895422d000733a8dedc526_5addef27c3" tabindex="-1" value="">
                </div>
                <div class="optionalParent">
                <div class="">
                    <input type="submit" name="subscribe" id="mc-embedded-subscribe" value="Subscribe">
                </div>
                </div>
            </form>
            <div class="social-links">
                <a href="#" class="social-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none">
                        <path d="M19.6497 1.89418C18.9371 2.21575 18.1712 2.43232 17.3674 2.52994C18.1882 2.03035 18.8184 1.23872 19.1146 0.295324C18.3471 0.757998 17.4965 1.09434 16.5911 1.27564C15.8672 0.490566 14.8334 0 13.6907 0C11.1251 0 9.23995 2.43314 9.81939 4.95898C6.51788 4.79081 3.59002 3.18294 1.62978 0.73913C0.588724 2.55455 1.08988 4.92945 2.85886 6.13207C2.20841 6.11075 1.59507 5.92945 1.06002 5.62674C1.01644 7.49795 2.33592 9.24856 4.24693 9.63823C3.68767 9.79245 3.07514 9.82855 2.45213 9.70714C2.95732 11.3117 4.42448 12.4791 6.16441 12.5119C4.49388 13.8433 2.38918 14.4381 0.28125 14.1854C2.03974 15.3314 4.12911 16 6.37262 16C13.7504 16 17.9186 9.66612 17.6668 3.98523C18.4432 3.41509 19.117 2.70386 19.6497 1.89418Z" fill="#151515"/>
                    </svg>
                </a>
                <a href="#" class="social-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="16" viewBox="0 0 22 16" fill="none">
                        <path d="M18.4204 1.32631C17.0825 0.71242 15.6478 0.260131 14.1477 0.00108666C14.1204 -0.00391282 14.0931 0.00858115 14.079 0.0335697C13.8945 0.361747 13.6901 0.789881 13.547 1.12639C11.9336 0.884845 10.3284 0.884845 8.74807 1.12639C8.60492 0.782401 8.39311 0.361747 8.20777 0.0335697C8.19369 0.00941489 8.1664 -0.00307908 8.13909 0.00108666C6.63983 0.259303 5.20512 0.711592 3.86638 1.32631C3.85479 1.33131 3.84485 1.33965 3.83826 1.35047C1.11692 5.4161 0.371425 9.3818 0.737137 13.2983C0.738792 13.3175 0.749548 13.3358 0.764442 13.3475C2.55991 14.666 4.29912 15.4665 6.00604 15.9971C6.03336 16.0054 6.06231 15.9954 6.07969 15.9729C6.48346 15.4215 6.84339 14.8401 7.15199 14.2287C7.1702 14.1929 7.15282 14.1504 7.1156 14.1363C6.54469 13.9197 6.00108 13.6557 5.47816 13.3558C5.43679 13.3317 5.43348 13.2725 5.47153 13.2442C5.58158 13.1617 5.69165 13.0759 5.79672 12.9893C5.81573 12.9735 5.84222 12.9701 5.86457 12.9801C9.29994 14.5486 13.0191 14.5486 16.414 12.9801C16.4363 12.9693 16.4628 12.9726 16.4826 12.9885C16.5877 13.0751 16.6978 13.1617 16.8086 13.2442C16.8467 13.2725 16.8442 13.3317 16.8029 13.3558C16.2799 13.6615 15.7363 13.9197 15.1646 14.1354C15.1274 14.1496 15.1108 14.1929 15.129 14.2287C15.4442 14.8393 15.8042 15.4207 16.2005 15.9721C16.217 15.9954 16.2468 16.0054 16.2741 15.9971C17.9893 15.4665 19.7285 14.666 21.524 13.3475C21.5397 13.3358 21.5497 13.3183 21.5513 13.2992C21.989 8.77122 20.8182 4.83804 18.4477 1.3513C18.4419 1.33965 18.432 1.33131 18.4204 1.32631ZM7.66501 10.9136C6.63073 10.9136 5.77851 9.96403 5.77851 8.79789C5.77851 7.63175 6.6142 6.6822 7.66501 6.6822C8.72406 6.6822 9.56803 7.64009 9.55148 8.79789C9.55148 9.96403 8.71579 10.9136 7.66501 10.9136ZM14.64 10.9136C13.6058 10.9136 12.7535 9.96403 12.7535 8.79789C12.7535 7.63175 13.5892 6.6822 14.64 6.6822C15.6991 6.6822 16.543 7.64009 16.5265 8.79789C16.5265 9.96403 15.6991 10.9136 14.64 10.9136Z" fill="#151515"/>
                    </svg>
                </a>
                <a href="#" class="social-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none">
                        <path d="M19.6646 1.45657L16.7856 15.0342C16.5684 15.9924 16.0019 16.2309 15.1969 15.7796L10.8102 12.5469L8.6936 14.5828C8.45943 14.817 8.26346 15.0129 7.81201 15.0129L8.12713 10.5452L16.2575 3.19847C16.611 2.88334 16.1808 2.70869 15.7081 3.02386L5.65698 9.35266L1.32987 7.99835C0.388643 7.70445 0.371638 7.05707 1.52576 6.60566L18.4508 0.085202C19.2344 -0.208647 19.9202 0.25977 19.6646 1.45657Z" fill="#151515"/>
                    </svg>
                </a>
            </div>
          </div>
        </div>
        <script type="text/javascript" src="//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js"></script>
        <script type="text/javascript">(function($) {window.fnames = new Array(); window.ftypes = new Array();fnames[0]='EMAIL';ftypes[0]='email';fnames[1]='FNAME';ftypes[1]='text';fnames[2]='LNAME';ftypes[2]='text';fnames[3]='ADDRESS';ftypes[3]='address';fnames[4]='PHONE';ftypes[4]='phone';fnames[5]='BIRTHDAY';ftypes[5]='birthday';}(jQuery));var $mcj = jQuery.noConflict(true);</script>
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.6/iframeResizer.contentWindow.js"></script>
      </div>
      `}
  />
);
