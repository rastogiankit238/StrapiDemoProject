import Link from 'next/link';

const Games = ({ games }) => {
  return (
    <>
      <ul className="list-none space-y-4 text-4xl font-bold mb-3">
        {games &&
          games.data.map((game) => {
            const releasedYear = new Date(game.attributes.released).getFullYear();
            return (
              <li key={game.id}>
                <Link href={`game/` + game.attributes.slug}>
                  {game.attributes.title}({releasedYear})
                </Link>
              </li>
            );
          })}
      </ul>
    </>
  );
};

export default Games;