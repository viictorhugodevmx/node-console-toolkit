import { readUsers } from '../users/user.repository';
import type { User } from '../users/user.types';

interface DomainStat {
  domain: string;
  total: number;
}

interface UserStats {
  total: number;
  firstCreatedUser: User | null;
  lastCreatedUser: User | null;
  domains: DomainStat[];
}

function getEmailDomain(email: string): string {
  const [, domain = 'unknown'] = email.split('@');

  return domain.toLowerCase();
}

export function getUserStats(): UserStats {
  const users = readUsers();

  if (users.length === 0) {
    return {
      total: 0,
      firstCreatedUser: null,
      lastCreatedUser: null,
      domains: []
    };
  }

  const sortedUsers = [...users].sort((firstUser, secondUser) => {
    return new Date(firstUser.createdAt).getTime() - new Date(secondUser.createdAt).getTime();
  });

  const domainCounter = new Map<string, number>();

  for (const user of users) {
    const domain = getEmailDomain(user.email);
    const currentTotal = domainCounter.get(domain) ?? 0;

    domainCounter.set(domain, currentTotal + 1);
  }

  const domains = Array.from(domainCounter.entries())
    .map(([domain, total]) => ({
      domain,
      total
    }))
    .sort((firstDomain, secondDomain) => {
      return secondDomain.total - firstDomain.total;
    });

  return {
    total: users.length,
    firstCreatedUser: sortedUsers[0],
    lastCreatedUser: sortedUsers[sortedUsers.length - 1],
    domains
  };
}
