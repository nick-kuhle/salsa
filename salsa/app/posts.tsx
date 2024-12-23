"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Likes from "./likes";
import { useEffect, useOptimistic } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Posts({ posts }: { posts: PostWithAuthor[] }) {
  const [optimisticPosts, addOptimisticPost] = useOptimistic<
    PostWithAuthor[],
    PostWithAuthor
  >(posts, (currentOptimisticPosts, newPost) => {
    const newOptimisticPosts = [...currentOptimisticPosts];
    const index = newOptimisticPosts.findIndex(
      (post) => post.id === newPost.id
    );
    newOptimisticPosts[index] = newPost;
    return newOptimisticPosts;
  });

  const supabase = createClientComponentClient()
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel("post feed")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "posts",
        },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  return optimisticPosts.map((post) => (
    <div key={post.id} className="border border-gray-800 border-t-0 px-4 py-8 flex">
      <div className="h-12 w-12">
        <Image
          className="rounded-full"
          src={post.author.avatar_url}
          alt="user avatar"
          width={48}
          height={48}
        />
      </div>
      <div className="ml-4">
        <p>
          <span className="font-bold">{post.author.name}</span>
          <span className="text-sm ml-2 text-gray-400">{post.author.username}</span>
        </p>
        <div flex-1 flex-col justify-between mx-auto>
          <p>
            <span className="text-xl text-bold justify-center">{post.strain}</span>
            <span>{post.title}</span>
          </p>
        </div>
        <Likes post={post} addOptimisticPost={addOptimisticPost} />
      </div>
    </div>
  ));
}