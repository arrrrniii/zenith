import React from 'react';
import { useRouter } from 'next/router';
import { GET_BLOG_BY_SLUG } from '@/components/dashboard/blog/graphql/BlogMutations';
import { BlockRenderer } from '@/components/dashboard/blog/blog/blocks/components/BlockRenderer/index';
import Header from '@/components/client/Header';
import Footer from '@/components/client/Footer';
import Head from 'next/head';
import Image from "next/legacy/image";
import Link from 'next/link';
import { client } from '@/lib/apollo-client';

// Error component
const ErrorState = ({ message }) => (
  <div className="min-h-screen">
    <Header />
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-red-50 p-4 rounded-lg">
        <h2 className="text-lg font-medium text-red-800 mb-2">Error</h2>
        <p className="text-sm text-red-600">{message}</p>
      </div>
    </main>
    <Footer />
  </div>
);

// 404 component
const NotFound = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600 mb-6">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push('/blog')}
            className="text-blue-600 hover:underline"
          >
            View all blog posts
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const BlogPost = ({ post }) => {
  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const sortedBlocks = [...post.blog_content_blocks]
    .sort((a, b) => a.order_index - b.order_index);

  return (
    <div className="min-h-screen">
      <Head>
        <title>{post.titletag || post.title}</title>
        <meta name="description" content={post.description} />
        {post.keywords && <meta name="keywords" content={post.keywords} />}
      </Head>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Blog Header */}
        {/* <header className="mb-8">
          {post.category && (
            <div className="mb-4">
              <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                {post.category}
              </span>
            </div>
          )}
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center space-x-4 text-gray-600">
            <time dateTime={post.created_at}>{formattedDate}</time>
          </div>
        </header> */}

        {/* Featured Image */}
        {/* {post.thumbnail_url && (
          <div className="mb-8 relative h-[400px] w-full">
            <Image
              src={post.thumbnail_url}
              alt={post.title}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
              priority
            />
          </div>
        )} */}

        {/* Description */}
        {/* {post.description && (
          <div className="text-lg text-gray-600 mb-8">
            {post.description}
          </div>
        )} */}

        {/* Blog Content using BlockRenderer */}
        <article className="prose max-w-none mb-12">
          <BlockRenderer blocks={sortedBlocks} />
        </article>

        {/* Keywords/Tags */}
        {post.keywords && (
          <div className="mt-8 pt-8 border-t">
            <div className="flex flex-wrap gap-2">
              {post.keywords.split(',').map((keyword, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                >
                  {keyword.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

const BlogPostPage = ({ post, error }) => {
  if (error) return <ErrorState message={error} />;
  if (!post) return <NotFound />;
  return <BlogPost post={post} />;
};

export async function getServerSideProps({ params }) {
  try {
    const { data } = await client.query({
      query: GET_BLOG_BY_SLUG,
      variables: { slug: params.slug },
    });

    const post = data?.blogs?.[0];

    if (!post) {
      return { props: { post: null } };
    }

    return {
      props: {
        post,
      },
    };
  } catch (error) {
    console.error('Error fetching blog:', error);
    return {
      props: {
        error: 'Failed to load blog post. Please try again later.',
        post: null,
      },
    };
  }
}

export default BlogPostPage;