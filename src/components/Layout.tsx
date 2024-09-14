import FooterMenu from "./FooterMenu";

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: ILayoutProps) => {
  return (
    <div className="layout">
      {children}
      <FooterMenu />
    </div>
  );
};

export default Layout;
