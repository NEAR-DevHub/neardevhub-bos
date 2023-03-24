/* INCLUDE: "common.jsx" */
const nearDevGovGigsContractAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];
const nearDevGovGigsWidgetsAccountId =
  props.nearDevGovGigsWidgetsAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

function widget(widgetName, widgetProps, key) {
  widgetProps = {
    ...widgetProps,
    nearDevGovGigsContractAccountId: props.nearDevGovGigsContractAccountId,
    nearDevGovGigsWidgetsAccountId: props.nearDevGovGigsWidgetsAccountId,
    referral: props.referral,
  };
  return (
    <Widget
      src={`${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.${widgetName}`}
      props={widgetProps}
      key={key}
    />
  );
}

function href(widgetName, linkProps) {
  linkProps = { ...linkProps };
  if (props.nearDevGovGigsContractAccountId) {
    linkProps.nearDevGovGigsContractAccountId =
      props.nearDevGovGigsContractAccountId;
  }
  if (props.nearDevGovGigsWidgetsAccountId) {
    linkProps.nearDevGovGigsWidgetsAccountId =
      props.nearDevGovGigsWidgetsAccountId;
  }
  if (props.referral) {
    linkProps.referral = props.referral;
  }
  const linkPropsQuery = Object.entries(linkProps)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return `#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}
/* END_INCLUDE: "common.jsx" */

const Banner = styled.div`
   {
    position: fixed;
    left: calc(-50vw + 50%);
    width: 100vw;
    height: 100px;
    background: #232323;
    z-index: 2;
    margin-top: -24px;

    overflow: hidden;
  }
`;

const Logo = styled.div`
   {
    position: fixed;
    padding: 32px 0;
    z-index: 4;
    margin-top: -24px;

    img {
      height: 36px;
    }
  }
`;

const Scroll = styled.div`
   {
    z-index: -1;
    margin-top: calc(-24px + 100px + 25px);
  }
`;

const Gradient = styled.div`
   {
    position: absolute;
    left: -48vw;
    width: 173vw;
    height: 70vw;
    top: -40vw;
    transform: rotate(9.78deg);
    background: linear-gradient(
      -90deg,
      rgb(0, 204, 255) 0.57%,
      rgb(50, 82, 166) 100.57%
    );
    opacity: 0.22;
    filter: blur(17vw);
    z-index: 3;
  }
`;

const FeaturedCommunity = styled.div`
   {
    border: 1px solid #eceef0;

    /* Shadow/sm */
    box-shadow: 0px 1px 3px rgba(16, 24, 40, 0.1),
      0px 1px 2px rgba(16, 24, 40, 0.06);
    border-radius: 16px;
  }
`;

return (
  <>
    <Banner>
      <Gradient></Gradient>
    </Banner>
    <Logo>
      <a href={href("Feed")}>
        <img src="https://ipfs.near.social/ipfs/bafkreifm5y7r6bqcjtef6wytrp7ysdxocmgmjffjziorqya4p7kbtamntu"></img>
      </a>
    </Logo>
    <Scroll>
      <div class="row">
        <div class="col-lg-9">
          <div class="h5">Posts</div>
          {widget("components.layout.Controls")}
          {widget("components.layout.Navbar", {
            children: props.navbarChildren,
          })}
          {props.children}
        </div>
        <div class="col-lg-3">
          <div class="h5">Featured Communities</div>
          <FeaturedCommunity>
            <div class="p-3">
              <div class="d-flex flex-row align-items-center">
                <img src="https://ipfs.near.social/ipfs/bafkreihbjm67uavkjkvfqomzx5v63t6kossqwfuptdxfb4vbcpbw3gezdm"></img>
                <div class="nav navbar-brand h1 p-2">Zero Knowledge</div>
              </div>
              <div class="mt-2 text-secondary">
                Building a zero knowledge ecosystem on NEAR.
              </div>
            </div>
            <div class="border-top p-3">
              <a class="btn btn-light rounded-5 border w-100">View Details</a>
            </div>
          </FeaturedCommunity>
        </div>
      </div>
    </Scroll>
  </>
);
