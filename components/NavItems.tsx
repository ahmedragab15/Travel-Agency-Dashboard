import { Link, NavLink } from "react-router";
import { sidebarItems } from "~/constants";
import { cn } from "~/lib/utils";

const NavItems = ({ handleClick }: { handleClick?: () => void }) => {
  const user = {
    name: "Ahmed",
    email: "ragabahmed154@gmail.com",
    imageUrl: "/assets/images/david.webp",
  };
  return (
    <section className="nav-items">
      <Link to="/" className="link-logo">
        <img src="/assets/icons/logo.svg" alt="logo" className="size-[30px]" />
        <h1>Tourvisto</h1>
      </Link>
      <div className="container">
        <nav>
          {sidebarItems.map(({ id, href, icon, label }) => (
            <NavLink to={href} key={id}>
              {({ isActive }: { isActive: boolean }) => (
                <div className={cn("group nav-item", { "bg-primary-100 !text-white": isActive })} onClick={handleClick}>
                  <img src={icon} alt={label} className={`group-hover:brightness-0 group-hover:invert ${isActive ? "brightness-0 invert" : "text-dark-200"}`} /> {label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
        <footer className="nav-footer">
          <img src={user?.imageUrl || "/assets/images/david.webp"} alt={user?.name || "Ahmed"} />
          <article>
            <h2 title={user?.name}>{user?.name}</h2>
            <p title={user?.email}>{user?.email}</p>
          </article>
          <button onClick={() => alert("Logout")} className="cursor-pointer">
            <img src="/assets/icons/logout.svg" alt="logout" className="size-6" />
          </button>
        </footer>
      </div>
    </section>
  );
};

export default NavItems;

/*
  {
    id: 1,
    icon: "/assets/icons/home.svg",
    label: "Dashboard",
    href: "/dashboard",
  },
*/
