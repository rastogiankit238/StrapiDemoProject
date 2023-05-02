import React,{useState} from 'react'
import Layout from '@/components/Layout'
import { fetcher } from '../lib/api';
import Games from '@/components/Games';
import useSWR from 'swr';
import { useFetchUser } from '@/lib/authContext';

const GamesPage = ({games,navData}) => {
const {user,loading}=useFetchUser();
const [pageIndex, setPageIndex] = useState(1);
const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/games?pagination[page]=${pageIndex}&pagination[pageSize]=5`,
    fetcher,
    {
        fallbackData: games,
    }
    );
  return (
    <Layout user={user} navData={navData}>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter mb-4">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 py-2">
          Games
        </span>
      </h1>
        <Games games={data}/>
        <div className="space-x-2 space-y-2">
        <button
          className={`md:p-2 rounded py-2 text-black text-white p-2 ${
            pageIndex === 1 ? 'bg-gray-300' : 'bg-blue-400'
          }`}
          disabled={pageIndex === 1}
          onClick={() => setPageIndex(pageIndex - 1)}
        >
          {' '}
          Previous
        </button>
        <button
          className={`md:p-2 rounded py-2 text-black text-white p-2 ${
            pageIndex === (data && data.meta.pagination.pageCount)
              ? 'bg-gray-300'
              : 'bg-blue-400'
          }`}
          disabled={pageIndex === (data && data.meta.pagination.pageCount)}
          onClick={() => setPageIndex(pageIndex + 1)}
        >
          Next
        </button>
        <span>{`${pageIndex} of ${
          data && data.meta.pagination.pageCount
        }`}</span>
      </div>
    </Layout>
  )
}

export default GamesPage;

export async function getStaticProps() {
    const gamesResponse = await fetcher(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/games?pagination[page]=1&pagination[pageSize]=5`
    );
    const navDataResponse = await fetcher(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/navbar?populate=*`
    );
    return {
      props: {
        games: gamesResponse,
        navData:navDataResponse
      },
    };
  }