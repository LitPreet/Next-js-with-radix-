import { patchIssueSchema } from "@/app/ValidationSchema";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import authOptions from "@/app/auth/authOptions";
import { getServerSession } from "next-auth";


export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    const session = getServerSession(authOptions);
    if (!session) return NextResponse.json({}, { status: 401 })
    const body = await request.json();
    const validation = patchIssueSchema.safeParse(body);
    if (!validation.success)
        return NextResponse.json(validation.error.format(), { status: 400 })

    const { assignedToUserId, title, description } = body;
    if (assignedToUserId) {
        const user = await prisma.user.findUnique({ where: { id: assignedToUserId } })
        if (!user)
            return NextResponse.json({ error: 'Invalid User' }, { status: 400 })
    }

    const issue = await prisma.issue.findUnique({
        where: { id: parseInt(params.id) }
    });
    if (!issue)
        return NextResponse.json({ error: 'Invalid Issue' }, { status: 404 })

    const updatedIssue = await prisma.issue.update({
        where: { id: issue.id },
        data: {
            title,
            description,
            assignedToUserId
            
        }
    })
    return NextResponse.json(updatedIssue)

}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const session = getServerSession(authOptions);
    if (!session) return NextResponse.json({}, { status: 401 })

    const issue = await prisma.issue.findUnique({
        where: { id: parseInt(params.id) }
    });

    if (!issue)
        return NextResponse.json({ error: 'Invalid Issue' }, { status: 404 })
    const deleteIssue = await prisma.issue.delete({
        where: { id: issue.id }
    })

    return NextResponse.json({});
}
