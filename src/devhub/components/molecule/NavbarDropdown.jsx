const title = props.title;
const links = props.links;
const href = props.href;

const [showMenu, setShowMenu] = useState(false);

const Dropdown = styled.div`
  position: relative;
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
  position: absolute;
  top: -1rem;

  &.active {
    padding: 0.5rem 1rem;
    padding-top: 1rem;
    border-radius: 1rem;
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

const DropdownLink = styled.a`
  color: inherit;
  text-decoration: none;
  transition: all 300ms;

  &.active {
    color: #00ec97;
  }

  &:hover {
    color: #00ec97;
  }
`;

return (
  <Dropdown
    onMouseEnter={() => setShowMenu(true)}
    onMouseLeave={() => setShowMenu(false)}
  >
    {href ? (
      <DropdownLink className={href === props.page && "active"} href={href}>
        {title}
      </DropdownLink>
    ) : (
      <p
        style={{ color: `${links[0].href === props.page && "#00ec97"}` }}
        className={`m-0 ${showMenu && "active"}`}
      >
        {title} ↓
      </p>
    )}
    {showMenu && links.length !== 0 && (
      <DropdownMenu className={`${showMenu && "active"}`}>
        <div className="d-flex flex-column gap-3">
          {links.map((link) => (
            <DropdownLink
              className={link.href === props.page && "active"}
              href={`/${REPL_DEVHUB}/widget/app?page=${link.href}`}
              key={`${link.title}-${link.href}`}
            >
              {link.title}
            </DropdownLink>
          ))}
        </div>
      </DropdownMenu>
    )}
  </Dropdown>
);
