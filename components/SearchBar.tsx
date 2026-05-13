// src/components/SearchBar.tsx

'use client';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import Image from 'next/image';

import Link from 'next/link';

import type {
  Route,
} from 'next';

interface SearchProduct {
  id: string;
  name: string;
  category?: string;
  image?: string;
}

interface SearchBarProps {
  products: SearchProduct[];
}

export default function SearchBar({
  products,
}: SearchBarProps) {

  const [query, setQuery] =
    useState('');

  const [results, setResults] =
    useState<SearchProduct[]>([]);

  const [isOpen, setIsOpen] =
    useState(false);

  const containerRef =
    useRef<HTMLDivElement>(null);

  /* =========================================================
     CLOSE OUTSIDE
  ========================================================= */

  useEffect(() => {

    const handleClickOutside = (
      event: MouseEvent
    ) => {

      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node
        )
      ) {

        setIsOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };

  }, []);

  /* =========================================================
     SEARCH
  ========================================================= */

  useEffect(() => {

    if (!query.trim()) {

      setResults([]);

      return;
    }

    const timeout =
      setTimeout(() => {

        const filtered =
          products

            .filter(product =>

              product.name
                ?.toLowerCase()
                .includes(
                  query.toLowerCase()
                )
            )

            .slice(0, 8);

        setResults(filtered);

        setIsOpen(true);

      }, 200);

    return () =>
      clearTimeout(timeout);

  }, [
    query,
    products,
  ]);

  /* =========================================================
     UI
  ========================================================= */

  return (

    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">

      <div className="container-custom py-4">

        <div
          ref={containerRef}
          className="relative max-w-3xl mx-auto"
        >

          {/* SEARCH ICON */}
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 z-10">

            🔍

          </div>

          {/* INPUT */}
          <input
            type="text"
            value={query}
            onChange={e =>
              setQuery(
                e.target.value
              )
            }
            placeholder="Rechercher un équipement..."
            className="
              w-full
              h-14
              rounded-2xl
              border
              border-gray-200
              bg-white
              pl-14
              pr-4
              text-sm
              shadow-sm
              focus:outline-none
              focus:ring-2
              focus:ring-red-500
              transition
            "
          />

          {/* RESULTS */}
          {isOpen &&
            results.length > 0 && (

              <div
                className="
                  absolute
                  top-full
                  left-0
                  right-0
                  mt-3
                  bg-white
                  border
                  border-gray-100
                  rounded-2xl
                  shadow-2xl
                  overflow-hidden
                "
              >

                {results.map(product => (

                  <Link
                    key={product.id}
                    href={`/produits/${product.id}` as Route}
                    className="
                      flex
                      items-center
                      gap-3
                      p-3
                      hover:bg-gray-50
                      transition
                    "
                    onClick={() => {

                      setIsOpen(false);

                      setQuery('');
                    }}
                  >

                    {/* IMAGE */}
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">

                      {product.image ? (

                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />

                      ) : (

                        <div className="w-full h-full flex items-center justify-center text-xl">

                          🏪

                        </div>
                      )}

                    </div>

                    {/* INFO */}
                    <div className="min-w-0">

                      <p className="font-medium text-sm text-gray-900 line-clamp-1">

                        {product.name}

                      </p>

                      <p className="text-xs text-gray-500 mt-1">

                        {product.category}

                      </p>

                    </div>

                  </Link>
                ))}

              </div>
            )}

        </div>

      </div>

    </div>
  );
}