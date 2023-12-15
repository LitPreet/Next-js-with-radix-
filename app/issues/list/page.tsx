import React from "react";
import { Table } from "@radix-ui/themes";
import Link from "next/link";
import {IssueStatusBadge } from "@/app/components/index";
import prisma from "@/prisma/client";
import IssueActions from "./IssueActions";
import { Issue, Status } from "@prisma/client";
import { ArrowUpIcon } from "@radix-ui/react-icons";

const IsssuesPage = async ({
  searchParams,
}: {
  searchParams: { status: Status , orderBy: keyof Issue};
}) => {
  const columns: { label: string; value: keyof Issue; classname?: string }[] = [
    {
      label: "Issue",
      value: "title",
    },
    { label: "Status", value: "status", classname: "hidden md:table-cell" },
    { label: "Created", value: "createdAt", classname: "hidden md:table-cell" },
  ];

  const statuses = Object.values(Status);
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;
  const issues = await prisma.issue.findMany({
    where: {
      status,
    },
  });

  // await delay(2000)
  return (
    <div>
      <IssueActions />
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            {columns.map((column) => (
 <Table.ColumnHeaderCell key={column.value} className={column.classname}><Link href={{
  query: {...searchParams, orderBy: column.value}
 }}>{column.label}</Link>
 {column.value === searchParams.orderBy && <ArrowUpIcon className="inline"/>}
 </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {issues.map((issue) => (
            <Table.Row key={issue.id}>
              <Table.Cell>
                <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
                <div className="block md:hidden">
                  <IssueStatusBadge status={issue.status} />
                </div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <IssueStatusBadge status={issue.status} />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {issue.createdAt.toDateString()}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};
export const dynamic = "force-dynamic";
// export const revalidate = 0;cons

export default IsssuesPage;
