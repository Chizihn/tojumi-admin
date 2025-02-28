import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Users,
  User,
  Building,
  UserPlus,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
  List,
  Book,
} from "lucide-react";
import { useSidebarStore } from "@/store/useSidebarStore";
import Button from "./ui/Button";
import { useAuthStore } from "@/store/useAuthStore";

type SidebarLink = {
  name: string;
  href?: string;
  icon: React.ReactNode;
};

type SidebarMenuLink = SidebarLink & {
  subLinks?: SidebarLink[];
};

const sidebarStructure = [
  {
    name: "Main",
    links: [
      { name: "Overview", href: "/dashboard", icon: <Home size={18} /> },
      {
        name: "All Users",
        href: "/dashboard/users",
        icon: <Users size={18} />,
      },
    ],
  },
  {
    name: "Family Management",
    links: [
      {
        name: "Family Owners",
        icon: <List size={18} />,
        subLinks: [
          {
            name: "All Family Owners",
            href: "/family-owners",
            icon: <User size={18} />,
          },
          {
            name: "Dependents",
            href: "/family-owners/dependents",
            icon: <UserPlus size={18} />,
          },
        ],
      },
    ],
  },
  {
    name: "Provider Management",
    links: [
      {
        name: "Providers",
        icon: <Building size={18} />,
        subLinks: [
          {
            name: "All Carebusiness",
            href: "/dashboard/providers",
            icon: <User size={18} />,
          },
          {
            name: "All Carehomes",
            href: "/dashboard/carehomes",
            icon: <List size={18} />,
          },
        ],
      },
    ],
  },

  {
    name: "Students",
    links: [
      {
        name: "Students",
        icon: <Book size={18} />,
        subLinks: [
          {
            name: "All Students",
            href: "/dashboard/students",
            icon: <User size={18} />,
          },
          {
            name: "All Guarantors",
            href: "/dashboard/guarantors",
            icon: <Users size={18} />,
          },
        ],
      },
    ],
  },
  {
    name: "System",
    links: [
      { name: "Settings", href: "/settings", icon: <Settings size={18} /> },
    ],
  },
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { openMenus, toggleMenu } = useSidebarStore();

  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const renderLink = (link: SidebarMenuLink) => {
    if (link.subLinks) {
      return (
        <li key={link.name}>
          <div
            onClick={() => toggleMenu(link.name)}
            className="flex items-center justify-between gap-2 py-2 px-3 text-sm cursor-pointer hover:bg-gray-100"
          >
            <div className="flex items-center gap-3">
              {link.icon}
              {link.name}
            </div>
            {openMenus[link.name] ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </div>
          {openMenus[link.name] && (
            <ul className="ml-6">
              {link.subLinks.map((subLink) => (
                <li key={subLink.name}>
                  <Link
                    href={subLink.href || ""}
                    className={`flex items-center gap-3 py-2 px-3 text-sm hover:bg-gray-100 ${
                      pathname === subLink.href && "bg-gray-200 font-semibold"
                    }`}
                  >
                    {subLink.icon}
                    {subLink.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    }

    return (
      <li key={link.name}>
        <Link
          href={link.href || ""}
          className={`flex items-center gap-3 py-2 px-3 text-sm hover:bg-gray-100 ${
            pathname === link.href && "bg-gray-200 font-semibold"
          }`}
        >
          {link.icon}
          {link.name}
        </Link>
      </li>
    );
  };

  return (
    <aside className="h-full w-full bg-white shadow-md flex flex-col">
      <div className="p-4 text-2xl font-bold text-left border-b">Dashboard</div>

      <nav className="flex-1 overflow-y-auto">
        {sidebarStructure.map((section) => (
          <div key={section.name} className="mb-2">
            <div className="px-6 py-2 text-xs font-semibold text-gray-500 uppercase">
              {section.name}
            </div>
            <ul>{section.links.map(renderLink)}</ul>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t">
        <Button type="button" variant="danger" onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </Button>
      </div>
    </aside>
  );
}
