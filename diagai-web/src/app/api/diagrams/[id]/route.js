import { NextResponse } from 'next/server';
import { diagramApi } from '../../../../services/diagramApi';

export async function GET(request, { params }) {
  try {
    const diagram = await diagramApi.getDiagram(params.id);
    return NextResponse.json(diagram);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch diagram' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const diagram = await diagramApi.updateDiagram(params.id, body);
    return NextResponse.json(diagram);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to update diagram' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await diagramApi.deleteDiagram(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete diagram' },
      { status: 500 }
    );
  }
}
