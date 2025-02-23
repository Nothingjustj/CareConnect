"use client"
import { RootState } from "@/store/store"
import { useSelector } from "react-redux"

export default function HospitalAdminDashboard () {

    const user = useSelector((state: RootState) => state.user);

    return (
        <div className="py-6 px-2">
            <h1 className="text-2xl font-semibold">Welcome {user.name}</h1>
        </div>
    )
}