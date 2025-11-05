'use client';
import styled from 'styled-components';
import NextLink from 'next/link';

import { ArrowUpRight } from 'lucide-react';

const Container = styled(NextLink)`
  color: inherit;
  text-decoration: underline;

  display: inline-flex;
  align-items: center;

  &:hover {
    color: var(--color-text-0);
    text-decoration: none;
  }
`;

const ExternalLinkIcon = styled(ArrowUpRight)`
  display: inline-block;
`;

type LinkProps = {
  href: string;
  children: React.ReactNode;
  external?: boolean;
};

const Link = ({ href, children, external = false }: LinkProps) => {
  return (
    <Container href={href} target={external ? '_blank' : '_self'}>
      {children}
      {external && <ExternalLinkIcon size={16} />}
    </Container>
  );
};

export default Link;
