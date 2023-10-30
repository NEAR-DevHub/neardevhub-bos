const page = props.page;
const small = page === "communities" || page === "community" || page === "feed";

return (
  <iframe
    iframeResizer
    srcDoc={`
      <div id="mc_embed_shell">
        <link href="//cdn-images.mailchimp.com/embedcode/classic-061523.css" rel="stylesheet" type="text/css">
        <style type="text/css">
          body {
            margin: 0;

            ${small && "height: 72px;"}
          }
          .container {
            max-width: 720px;
            margin: 0 auto;

            ${
              small &&
              `max-width: 100%; display: flex; flex-direction: row-reverse; align-items: center; justify-content: space-between; padding: 0 1rem;`
            }
          }
          .heading {
            color: #151515;
            text-align: center;
            font-size: 36px;
            font-style: normal;
            font-weight: 700;
            line-height: 120%; /* 43.2px */

            ${small && "display: none"}
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

            ${small && "margin-bottom: 12px"}
          }
          #mc_embed_signup {
              background: #00EC97;
              clear: left; 
              font: 14px Helvetica, Arial, sans-serif; 
              padding: 20px;
              text-align: center;

              ${small && "padding: 0px"}
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

            ${small && "height: 36px; !important; "}
          }
          #mce-responses {
            display: none !important;
          }
          .form-group {
            display: flex !important;

            @media screen and (max-width: 768px) {
                flex-direction: column;
            }

            ${small && "gap: 32px; !important;"}
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

          #mce-EMAIL {
            ${small && "width: 240px; height: 20px; !important; "}
          }
        </style>
        <div id="mc_embed_signup">
          <div class="container">
          <div ${small && "style='display: flex; align-items: center;'"}>
          <h2 class="heading">/dev/hub newsletter</h2>
            <p class="lead">${
              !small
                ? "Stay in the loop. Get the latest updates, announcements, opportunities, and insights from the ecosystem in your inbox"
                : "Subscribe to our newsletter"
            }</p>
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
            </div>
            <div class="social-links">
                <a href="https://twitter.com/NEARDevGov" target="_blank" class="social-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none">
                        <path d="M19.6497 1.89418C18.9371 2.21575 18.1712 2.43232 17.3674 2.52994C18.1882 2.03035 18.8184 1.23872 19.1146 0.295324C18.3471 0.757998 17.4965 1.09434 16.5911 1.27564C15.8672 0.490566 14.8334 0 13.6907 0C11.1251 0 9.23995 2.43314 9.81939 4.95898C6.51788 4.79081 3.59002 3.18294 1.62978 0.73913C0.588724 2.55455 1.08988 4.92945 2.85886 6.13207C2.20841 6.11075 1.59507 5.92945 1.06002 5.62674C1.01644 7.49795 2.33592 9.24856 4.24693 9.63823C3.68767 9.79245 3.07514 9.82855 2.45213 9.70714C2.95732 11.3117 4.42448 12.4791 6.16441 12.5119C4.49388 13.8433 2.38918 14.4381 0.28125 14.1854C2.03974 15.3314 4.12911 16 6.37262 16C13.7504 16 17.9186 9.66612 17.6668 3.98523C18.4432 3.41509 19.117 2.70386 19.6497 1.89418Z" fill="#151515"/>
                    </svg>
                </a>
                <a href="https://t.me/NEARDevGov" target="_blank" class="social-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none">
                        <path d="M19.6646 1.45657L16.7856 15.0342C16.5684 15.9924 16.0019 16.2309 15.1969 15.7796L10.8102 12.5469L8.6936 14.5828C8.45943 14.817 8.26346 15.0129 7.81201 15.0129L8.12713 10.5452L16.2575 3.19847C16.611 2.88334 16.1808 2.70869 15.7081 3.02386L5.65698 9.35266L1.32987 7.99835C0.388643 7.70445 0.371638 7.05707 1.52576 6.60566L18.4508 0.085202C19.2344 -0.208647 19.9202 0.25977 19.6646 1.45657Z" fill="#151515"/>
                    </svg>
                </a>
                <a href="https://www.youtube.com/@NEARDevGov" class="social-link">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="35" height="28" viewBox="0,0,256,256">
                        <g fill="#151515" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.12,5.12)"><path d="M44.89844,14.5c-0.39844,-2.19922 -2.29687,-3.80078 -4.5,-4.30078c-3.29687,-0.69922 -9.39844,-1.19922 -16,-1.19922c-6.59766,0 -12.79687,0.5 -16.09766,1.19922c-2.19922,0.5 -4.10156,2 -4.5,4.30078c-0.40234,2.5 -0.80078,6 -0.80078,10.5c0,4.5 0.39844,8 0.89844,10.5c0.40234,2.19922 2.30078,3.80078 4.5,4.30078c3.5,0.69922 9.5,1.19922 16.10156,1.19922c6.60156,0 12.60156,-0.5 16.10156,-1.19922c2.19922,-0.5 4.09766,-2 4.5,-4.30078c0.39844,-2.5 0.89844,-6.10156 1,-10.5c-0.20312,-4.5 -0.70312,-8 -1.20312,-10.5zM19,32v-14l12.19922,7z"></path></g></g>
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
