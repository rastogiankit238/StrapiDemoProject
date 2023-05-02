import { fetcher } from "@/lib/api";
import Layout from "@/components/Layout";
import { useFetchUser } from "@/lib/authContext";
import {
  getTokenFromLocalCookie,
  getTokenFromServerCookie,
  getUserFromLocalCookie,
} from '../../lib/auth';
import markdownToHtml from '../../lib/markdownToHtml';
import { useRouter } from "next/router";
import { useState } from "react";

const Game = ({game, jwt, description, error}) => {
  const {user,loading}=useFetchUser();
  const router = useRouter();
  const [review, setReview] = useState({
    value: '',
  });

  const handleChange = (e) => {
    setReview({ value: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          data: {
            review: review.value,
            reviewer: await getUserFromLocalCookie(),
            game: game.id,
          },
        }),
      });
      router.reload();
    } catch (error) {
      console.error('error with request', error);
    }
  };
  if (error) {
    return (
      <Layout>
        <p>{error}</p>
      </Layout>
    );
  } else {
 return(
    <Layout user={user}>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 py-2">
            {game?.attributes?.title}
          </span>
        </h1>
        <p>
          Published by{' '}
          <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
            {game.attributes.publisher}
          </span>
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold leading-tighter mb-4 mt-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 py-2">
            Description
          </span>
        </h2>
        <div
          className="tracking-wide font-normal text-sm"
          dangerouslySetInnerHTML={{ __html: description }}
        ></div>
        {user && (
          <>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tighter mb-4 mt-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 py-2">
                Reviews
              </span>
              <form onSubmit={handleSubmit}>
                <textarea
                  className="w-full text-sm px-3 py-2 text-gray-700 border border-2 border-teal-400 rounded-lg focus:outline-none"
                  rows="4"
                  value={review.value}
                  onChange={handleChange}
                  placeholder="Add your review"
                ></textarea>
                <button
                  className="md:p-2 rounded py-2 text-black bg-purple-200 p-2"
                  type="submit"
                >
                  Add Review
                </button>
              </form>
            </h2>
            <ul>
              {game.attributes.reviews.data.length === 0 && (
                <span>No reviews yet</span>
              )}
              {game.attributes.reviews &&
                game.attributes.reviews.data.map((review) => {
                  return (
                    <li key={review.id}>
                      <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                        {review.attributes.reviewer}
                      </span>{' '}
                      said &quot;{review.attributes.review}&quot;
                    </li>
                  );
                })}
            </ul>
          </>
        )}
    </Layout>
 )
}
}

export async function getServerSideProps({params,req}){
  const {slug}=params;
  const jwt =
  typeof window !== 'undefined'
    ? getTokenFromLocalCookie
    : getTokenFromServerCookie(req);
    const gameResponse=await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/games?populate=*&filters[slug]=${slug}`,jwt
    ? {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    : ''
);
if (gameResponse.data) {
  const description = await markdownToHtml(gameResponse.data[0].attributes.description);
  return {
    props: {
      game: gameResponse.data[0],
      description,
      jwt: jwt ? jwt : '',
    },
  };
} else {
  return {
    props: {
      error: gameResponse.error.message,
    },
  };
}
}
export default Game;