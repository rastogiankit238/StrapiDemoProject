import React from "react";
import { MeiliSearch } from "meilisearch";
import { useState, useEffect } from "react";
import Link from "next/link";

const client = new MeiliSearch({
  host: NEXT_PUBLIC_MEILI_URL,
  apiKey:
  NEXT_PUBLIC_MEILI_API,
});

function Search() {
  const url = process.env.NEXT_PUBLIC_URL;
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    if (search === "") {
      setMovies([]);
      return;
    }
    //search movie index based on search value
    client
      .index("products")
      .search(search)
      .then((results) => {
        setMovies(results.hits);
      });
  }, [search]);

  return (
    <div className="App">
      <div className="search">
        <input
          className="searchInput"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {movies.length > 0 && (
        <div className="popup">
          <div className="movies">
            {movies.map((movie) => (
              <div className="movie" key={movie.id}>
                <div className="movie-info">
                  <Link
                    href={
                      movie.director
                        ? `${url}/film/${movie.slug}`
                        : `${url}/game/${movie.slug}`
                    }
                  >
                    {movie.title}{" "}
                    {movie.director
                      ? `directed by ${movie.director}`
                      : `published by ${movie.publisher}`}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;
