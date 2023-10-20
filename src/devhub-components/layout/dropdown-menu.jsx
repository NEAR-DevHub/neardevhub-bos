const title = props.title;
const links = props.links;
const href = props.href;

const [showMenu, setShowMenu] = useState(false);

const Dropdown = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    &.active {
      color: #fff;
    }
  }
`;

const DropdownMenu = styled.div`
  z-index: 50;

  &.active {
    padding: 0.5rem 1rem;
    padding-top: 1rem;
    border-radius: 16px;
    background: rgba(217, 217, 217, 0.7);
    backdrop-filter: blur(5px);
    width: max-content;
    animation: slide-down 300ms ease;
    transform-origin: top center;
  }

  @keyframes slide-down {
    0% {
      transform: scaleY(0);
    }
    100% {
      transform: scaleY(1);
    }
  }
`;

return (
  <Dropdown
    className="position-relative"
    onMouseEnter={() => setShowMenu(true)}
    onMouseLeave={() => setShowMenu(false)}
  >
    {href ? (
      <a style={{ color: "inherit", textDecoration: "none" }} href={href}>
        {title}
      </a>
    ) : (
      <p className={`m-0 ${showMenu && "active"}`}>{title}</p>
    )}
    {showMenu && links.length !== 0 && (
      <DropdownMenu
        className={`${showMenu && "active"} position-absolute`}
        style={{ top: -15 }}
      >
        <p style={{ color: "#00ec97" }}>{title}</p>
        <div className="d-flex flex-column gap-3">
          {links.map((link) => (
            <a
              href={link.href}
              key={`${link.title}-${link.href}`}
              style={{ color: "inherit", textDecoration: "none" }}
            >
              {link.title}
            </a>
          ))}
        </div>
      </DropdownMenu>
    )}
  </Dropdown>
);
