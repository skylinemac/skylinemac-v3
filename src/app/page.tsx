import Link from "next/link";

export default function Home() {
  return (
    <ul>
      <li>
        <Link href="/">Home</Link>
      </li>
      <li>
        <Link href="/registration">Registration</Link>
      </li>
      <li>
        <Link href="/userlist">User List</Link>
      </li>
    </ul>
  )
}
