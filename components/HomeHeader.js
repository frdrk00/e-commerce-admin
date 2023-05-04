import { useSession } from "next-auth/react"
import Image from "next/image"

export default function HomeHeader() {
    const {data: session} = useSession()
    return (
        <div className="text-gray-800 flex justify-between">
      <h2 className="mt-0">
        <div className="flex gap-2 items-center">
        <Image
          onClick={() => signOut()}
          src={session?.user?.image}
          width={28}
          height={28}
          alt="Profile pic"
          className= "cursor-pointer mx-auto rounded-md hover:opacity-50 sm:hidden"
        />
        <div>
          Hello, <b>{session?.user?.name}</b>
        </div>
        </div>
      </h2>
      <div className="hidden sm:block">
        <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden">
        <Image
          onClick={() => signOut()}
          src={session?.user?.image}
          width={28}
          height={28}
          alt="Profile pic"
          className="cursor-pointer mx-auto  hover:opacity-50"
        />
        <span className="px-2">
          {session?.user?.name}
        </span>
        </div>
      </div>
    </div>
    )
}