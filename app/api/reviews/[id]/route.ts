import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }>}) {
  try {
    const { id } = await params;
    if(!id){
        return NextResponse.json({
            message : "slug is required",
            success : false
        })
    }
    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

