declare interface BosContext {
  accountId?: string;
  networkId: NetworkId;
  props: object;
}

declare const Widget: (params: {
  src: string;
  props: object;
}) => React.ReactNode;

declare interface DevHubBaseProps {
  page: any;
}

declare var styled = {
  div,
  a,
  ul,
  span,
};
