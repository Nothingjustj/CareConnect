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
            url: "#features",
            active: true
        },
        {
            name: "Solutions",
            url: "#solutions",
            active: true
        },
        {
            name: "About",
            url: "/about",
            active: true
        },
        {
            name: "How It Works",
            url: "#how-it-works",
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