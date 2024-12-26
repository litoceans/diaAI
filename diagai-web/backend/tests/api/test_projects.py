import pytest
from httpx import AsyncClient
from fastapi import status
from bson import ObjectId

async def test_create_project(client, db, user_token):
    project_data = {
        "name": "Test Project",
        "description": "A test project"
    }
    
    response = await client.post(
        "/api/v1/projects/",
        json=project_data,
        headers={"Authorization": f"Bearer {user_token}"}
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["name"] == project_data["name"]
    assert data["description"] == project_data["description"]
    
    # Check database
    project = await db.projects.find_one({"_id": data["_id"]})
    assert project is not None

async def test_get_projects(client, db, user_token, test_user):
    # Create test projects
    projects = [
        {
            "_id": str(ObjectId()),
            "user_id": test_user["_id"],
            "name": f"Project {i}",
            "description": f"Description {i}",
            "diagrams": []
        }
        for i in range(3)
    ]
    await db.projects.insert_many(projects)
    
    response = await client.get(
        "/api/v1/projects/",
        headers={"Authorization": f"Bearer {user_token}"}
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) == 3

async def test_get_project(client, db, user_token, test_user):
    # Create test project
    project_id = str(ObjectId())
    project = {
        "_id": project_id,
        "user_id": test_user["_id"],
        "name": "Test Project",
        "description": "Test Description",
        "diagrams": []
    }
    await db.projects.insert_one(project)
    
    response = await client.get(
        f"/api/v1/projects/{project_id}",
        headers={"Authorization": f"Bearer {user_token}"}
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["name"] == project["name"]

async def test_update_project(client, db, user_token, test_user):
    # Create test project
    project_id = str(ObjectId())
    project = {
        "_id": project_id,
        "user_id": test_user["_id"],
        "name": "Old Name",
        "description": "Old Description",
        "diagrams": []
    }
    await db.projects.insert_one(project)
    
    update_data = {
        "name": "New Name",
        "description": "New Description"
    }
    
    response = await client.patch(
        f"/api/v1/projects/{project_id}",
        json=update_data,
        headers={"Authorization": f"Bearer {user_token}"}
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["name"] == update_data["name"]
    
    # Check database
    updated_project = await db.projects.find_one({"_id": project_id})
    assert updated_project["name"] == update_data["name"]

async def test_delete_project(client, db, user_token, test_user):
    # Create test project
    project_id = str(ObjectId())
    project = {
        "_id": project_id,
        "user_id": test_user["_id"],
        "name": "Test Project",
        "description": "Test Description",
        "diagrams": []
    }
    await db.projects.insert_one(project)
    
    response = await client.delete(
        f"/api/v1/projects/{project_id}",
        headers={"Authorization": f"Bearer {user_token}"}
    )
    
    assert response.status_code == status.HTTP_200_OK
    
    # Check database
    deleted_project = await db.projects.find_one({"_id": project_id})
    assert deleted_project is None
