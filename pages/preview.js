import Layout from "@/components/Layout";

import { useRouter } from "next/router";

import { useState, useEffect } from "react";

function PreviewPage() {
  const router = useRouter();
  const { type, slug } = router.query;
  const [respData, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/${type}?publicationState=preview&filters[slug]=${slug}`
        );
        const datas = await res.json();
        setData(datas);
      } catch (err) {
        console.error(err);
      }
    };

    if (type && slug) {
      fetchData();
    }
  }, [type, slug]);

  return (
    <Layout>
      {respData && respData !== undefined ? (
        <div>
          {/* <h1>{respData?.data[0]?.attributes?.title}</h1> */}
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter mb-4">
            {" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 py-2">
              {respData?.data[0]?.attributes?.title}
            </span>{" "}
          </h1>{" "}
          <p>
          {respData?.data[0]?.attributes?.director
                      ? `Directed By`
                      : `Published By`}
            <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                    {respData?.data[0]?.attributes?.director
                      ? ` ${respData?.data[0]?.attributes?.director}`
                      : ` ${respData?.data[0]?.attributes?.publisher}`}
            </span>{" "}
          </p>{" "}
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tighter mb-4 mt-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 py-2">
                {respData?.data[0]?.attributes?.description
                      ? `Description`
                      : `Plot`}
          </span>
          </h2>
          <div
          className="tracking-wide font-normal text-sm"
          dangerouslySetInnerHTML={{ __html: respData?.data[0]?.attributes?.plot
            ? ` ${respData?.data[0]?.attributes?.plot}`
            : ` ${respData?.data[0]?.attributes?.description}` }}
          ></div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </Layout>
  );
}

export default PreviewPage;
