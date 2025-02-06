import Link from "next/link";

export default function NavLinks () {

    const navlinks = [
        {
            name: "Home",
            url: "/",
            active: true
        },
        {
            name: "Features",
            url: "#",
            active: true
        },
        {
            name: "Solutions",
            url: "#",
            active: true
        },
        {
            name: "About",
            url: "/about",
            active: true
        },
        {
            name: "How It Works",
            url: "#",
            active: true
        },
        {
            name: "Contact",
            url: "/contact",
            active: true
        },
    ]

    return (
        <div className="hidden md:flex gap-8">
            {navlinks.map((navlink) => (
                <Link key={navlink.name} href={navlink.url} className="text-zinc-600 hover:text-black">{navlink.name}</Link>
            ))}
        </div>
    )
}