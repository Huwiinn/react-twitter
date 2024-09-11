interface ILayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: ILayoutProps) => {
  return <div className="layout">{children}</div>;
};

export default Layout;
