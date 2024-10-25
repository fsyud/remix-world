import * as React from 'react';
import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, NavLink } from '@remix-run/react';
import { getMDXComponent } from 'mdx-bundler/client';
import { getPostBySlug } from '~/utils/blog.server';
import { motion } from 'framer-motion';
import { blogPageMeta } from '~/utils/blog.meta';
import { textVariants, containerVariants } from '~/data/animationConfig';
import { ArrowLeft } from 'lucide-react';

export const meta = blogPageMeta;

export async function loader({ params }: LoaderFunctionArgs) {
	const { slug } = params;
	if (!slug) throw new Error('No slug provided');
	return await getPostBySlug(slug);
}

export default function BlogPost() {
	const { code, metadata } = useLoaderData<typeof loader>();

	const Component = React.useMemo(() => getMDXComponent(code), [code]);

	return (
		<motion.div variants={containerVariants} initial="hidden" animate="visible">
			<div className="mx-auto flex w-full max-w-[47rem]">
				<ArrowLeft />{' '}
				<NavLink className="back-button ml-2 font-sans" to={'/blog'}>
					Back
				</NavLink>
			</div>

			<header className="text-center">
				<motion.p
					variants={textVariants}
					className="my-10 font-sans font-semibold uppercase text-text-secondary dark:text-d-text-secondary"
				>
					{metadata.date}
				</motion.p>
				<motion.h1
					variants={textVariants}
					className="mb-20 text-4xl font-bold leading-[1.3] md:text-6xl"
				>
					{metadata.title}
				</motion.h1>
				<motion.hr variants={textVariants} className="w-[30%] min-w-[100px]" />
			</header>
			<motion.div variants={textVariants} className="flex justify-center posts-components">
				<div className="prose w-screen py-[1em] px-[2em] dark:prose-invert md:prose-lg lg:prose-xl prose-headings:text-text-primary prose-a:no-underline prose-pre:p-0 dark:prose-headings:text-d-text-primary">
					<Component />
				</div>
			</motion.div>
		</motion.div>
	);
}
