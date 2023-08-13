const svgIconsByVariant = {
  "floppy-drive": (elementProps) => (
    <svg
      fill="#ffffff"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      viewBox="0 0 353.073 353.073"
      {...elementProps}
    >
      <g>
        <path
          d={[
            "M340.969,0H12.105C5.423,0,0,5.423,0,12.105v328.863c0,6.68,5.423,12.105,12.105,12.105h328.864",
            "c6.679,0,12.104-5.426,12.104-12.105V12.105C353.073,5.423,347.647,0,340.969,0z",
            "M67.589,18.164h217.895v101.884H67.589V18.164z",
            "M296.082,327.35H57.003V176.537h239.079V327.35z",
            "M223.953,33.295h30.269v72.638h-30.269V33.295z",
            "M274.135,213.863H78.938v-12.105",
            "h195.197V213.863z",
            "M274.135,256.231H78.938v-12.105h195.197V256.231z",
            "M274.135,297.087H78.938v-12.105h195.197V297.087z",
          ].join(" ")}
        />
      </g>
    </svg>
  ),
};

const iconsByKind = {
  "bootstrap-icon": ({ className, variant, ...otherProps }) => (
    <i className={`bi ${variant} ${className}`} {...otherProps} />
  ),

  svg: ({ variant, ...elementProps }) =>
    svgIconsByVariant[variant](elementProps),
};

const Icon = ({ kind, ...otherProps }) =>
  typeof iconsByKind[kind] !== undefined ? iconsByKind[kind](otherProps) : null;

return Icon(props);
