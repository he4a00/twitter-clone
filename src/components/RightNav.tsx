import { api } from "~/utils/api";
import Button from "./Button";
import ProfileImage from "./ProfileImage";
import Link from "next/link";

const RightNav = () => {
  const { data } = api.user.getTrendingUsers.useQuery();
  console.log(data);
  return (
    <nav className="sticky top-0 m-0 hidden p-3 md:mr-10 md:inline md:p-10">
      <div className="flex flex-grow flex-col border p-5">
        <h1 className="border-b p-2 text-2xl font-bold">Who To Follow</h1>
        {data?.map((user) => (
          <div
            key={user.image}
            className="flex items-center justify-between border-b p-5"
          >
            <Link href={`/profiles/${user.id}`}>
              <ProfileImage width={50} height={50} src={user.image || ""} />
            </Link>
            <div className="ml-4 flex flex-col justify-center">
              <Link
                href={`/profiles/${user.id}`}
                className="font-bold hover:underline"
              >
                {user.name}
              </Link>
              <p className="mt-1">Likes: {user.likes.length}</p>
            </div>
            <div className="ml-10">
              <Button text={"Follow"} />
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default RightNav;
