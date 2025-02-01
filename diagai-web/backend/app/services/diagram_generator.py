import aiohttp
from PIL import Image
import io
import os
from typing import List, Optional, Tuple
import base64
from app.core.config import get_settings
from app.services.storage import StorageService
import json
import asyncio
from groq import AsyncGroq
import dotenv
import traceback
import logging
import random

dotenv.load_dotenv()

settings = get_settings()
storage = StorageService()

class DiagramGenerator:
    def __init__(self):
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        if not self.groq_api_key:
            raise ValueError("GROQ_API_KEY must be set in environment variables")
        self.client = AsyncGroq(api_key=self.groq_api_key)
        self.mermaid_api_url = "https://mermaid.ink/img/"
    
    async def _generate_mermaid_code(self, prompt: str, diagram_type: str, generation_type: str) -> str:
        example_output = ""
        if generation_type == "flowchart (Process Visualization)":
            example_output = """
            flowchart LR
                %% Node definitions
                A[<i class='fa fa-user'></i> Start]
                B[<i class='fa fa-cog'></i> Process]
                C[<i class='fa fa-check'></i> End]
                
                %% Connections
                A --> B
                B --> C
                
                %% Styling
                style A fill:#F0E68C, stroke:#333, stroke-width:2px
                style B fill:#87CEEB, stroke:#333, stroke-width:2px
                style C fill:#90EE90, stroke:#333, stroke-width:2px
            """
        elif generation_type == "sequence (Interaction Diagram)":
            example_output = """
            sequenceDiagram
                participant A as User
                participant B as Server
                participant C as Database
                
                A ->> B: Request Data
                B ->> C: Query Database
                C -->> B: Return Results
                B -->> A: Response Data
            """
        elif generation_type == "architecture (System Design)":
            example_output = """
            graph TD
                A[<i class='fa fa-user'></i> User]
                B[<i class='fa fa-server'></i> API]
                C[<i class='fa fa-cloud'></i> Cloud Service]
                D[<i class='fa fa-database'></i> Database]

                A --> B
                B --> C
                C --> D

                style A fill:#F0E68C
                style B fill:#98FB98
                style C fill:#87CEEB
                style D fill:#DDA0DD
            """
        elif generation_type == "git":
            example_output = """
            gitGraph
                commit id: "initial"
                
                branch develop
                checkout develop
                commit id: "feature-1"
                commit id: "feature-2"
                
                branch feature/auth
                checkout feature/auth
                commit id: "auth-1"
                commit id: "auth-2"
                
                checkout develop
                merge feature/auth
                
                checkout main
                merge develop tag: "v1.0.0"
                
                branch hotfix
                checkout hotfix
                commit id: "fix-1"
                
                checkout main
                merge hotfix tag: "v1.0.1"
            """
        elif generation_type == "erd (Database Design)":
            example_output = """
            erDiagram
                USER {
                    string username
                    string email
                    string password
                }
                ORDER {
                    int id
                    date orderDate
                    float totalAmount
                }
                PRODUCT {
                    int id
                    string name
                    float price
                }
                USER ||--o{ ORDER : places
                ORDER ||--|{ PRODUCT : contains
            """
        elif generation_type == "gantt (Project Schedule)":
            example_output = """
            gantt
                title Project Timeline
                dateFormat  YYYY-MM-DD
                section Development
                Backend Development   :done,    a1, 2025-01-01, 2025-01-10
                Frontend Development  :active,  a2, 2025-01-05, 2025-01-20
                section Testing
                Unit Testing          :         a3, 2025-01-15, 2025-01-25
                Integration Testing   :         a4, 2025-01-20, 2025-02-01
                section Deployment
                Deploy to Cloud       :         a5, 2025-02-05, 2025-02-10
            """
        elif generation_type == "class (Object-Oriented Design)":
            example_output = """
            classDiagram
                class User {
                    - string username
                    - string email
                    - string password
                    + login()
                    + logout()
                }
                class Order {
                    - int id
                    - date orderDate
                    - float totalAmount
                    + placeOrder()
                }
                class Product {
                    - int id
                    - string name
                    - float price
                    + calculateDiscount()
                }
                User "1" --> "0..*" Order
                Order "1" --> "1..*" Product
            """
        elif generation_type == "mindmap (Idea Organization)":
            example_output  = """
            mindmap
                root((Project Process))
                    Development
                    Back-end(API)
                    Front-end(UI)
                    Deployment
                    Cloud(Cloud Service)
                    Storage(Database)
            """
        """Generate Mermaid code using Groq"""
        try:
            system_prompt = f"""You are an expert at creating Mermaid diagrams. Generate Mermaid code for a {generation_type} based on the user's prompt.

            Rules for Mermaid Code Generation:
            1. Start with the appropriate diagram type declaration without any indentation
            2. Use consistent 4-space indentation for all nested elements
            3. Group related elements together with consistent spacing
            4. Place connecting arrows/relationships on their own lines
            5. Align style declarations at the same indentation level
            6. Include empty lines between logical sections
            7. Use descriptive node IDs that follow a consistent pattern
            8. Ensure all closing brackets/braces align with their opening counterparts
            9. Format multi-line labels with proper line breaks
            10. Keep styling consistent across similar elements

            Output Format Requirements:
            - Only output the Mermaid code, no explanations
            - No markdown code blocks (```)
            - No "Mermaid code:" prefix
            - Proper indentation throughout the code
            - Clean line breaks between sections

            Example Output Structure:
            {example_output}
            """
            print(system_prompt)
            print(prompt)
            max_retries = 5
            retry_count = 0
            
            while retry_count < max_retries:
                try:
                    random_model = random.choice(["mixtral-8x7b-32768","llama-3.1-8b-instant","llama-3.3-70b-versatile"])
                    chat_completion = await self.client.chat.completions.create(
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": prompt}
                        ],
                        model=random_model,
                        temperature=0.2,
                        max_tokens=2054,
                        timeout=60
                    )
                    
                    if not chat_completion or not chat_completion.choices:
                        raise ValueError("No response from Groq API")
                        
                    mermaid_code = chat_completion.choices[0].message.content.strip()
                    print("mermaid_code LLM response: ", mermaid_code)
                    
                    if not mermaid_code:
                        raise ValueError("No Mermaid code generated")
                    
                    # Test convert to image
                    try:
                        await self._mermaid_to_image(mermaid_code,"image")
                        return mermaid_code
                    except Exception as e:
                        print(f"Failed to validate Mermaid code on attempt {retry_count + 1}: {str(e)}")
                        retry_count += 1
                        continue
                        
                except Exception as e:
                    print(f"Error on attempt {retry_count + 1}: {str(e)}")
                    retry_count += 1
                    if retry_count >= max_retries:
                        raise ValueError(f"Failed to generate valid Mermaid code after {max_retries} attempts")
                    await asyncio.sleep(1)  # Wait before retry
            
            raise ValueError(f"Failed to generate valid Mermaid code after {max_retries} attempts")
            
        except asyncio.TimeoutError:
            print("Timeout while generating Mermaid code")
            raise ValueError("Request timed out while generating diagram code")
        except Exception as e:
            print(f"Error generating Mermaid code with Groq: {str(e)}")
            print(traceback.format_exc())
            raise ValueError(f"Failed to generate Mermaid code: {str(e)}")

    async def _generate_frame_mermaid_codes(self, mermaid_code: str, diagram_type: str, generation_type: str) -> List[str]:
        """Generate multiple Mermaid codes for GIF frames based on input mermaid code"""
        try:            
            system_prompt = f"""You are an expert at creating animated Mermaid diagrams. Generate exactly 5 frames showing smooth progression based on the provided Mermaid code:

            {mermaid_code}

            Rules for Frame Generation:
            1. Create exactly 5 frames showing smooth progression.
            2. Keep the same diagram type ({diagram_type}) across all frames.
            3. Maintain consistent node positions and styling.
            4. Each frame must be valid Mermaid code.
            5. Show logical step-by-step changes.

            Frame Structure Requirements:
            - Keep all original elements from input code.
            - Use consistent 4-space indentation.
            - Include section comments (%% Section) in each frame.
            - Maintain same styling/colors as input.
            - Each frame must be complete and valid.

            Animation Type Guidelines for {generation_type}:
            - Build elements progressively.
            - Show transitions smoothly.
            - Keep layout consistent.
            - Animate only relevant parts.
            - Maintain visual hierarchy.

            Frame Separator: ---FRAME---

            Example Frame Structure for a Flowchart:
            flowchart TD
                %% Node definitions
                A[Request]
                B[Routing]
                
                %% Connections
                A --> B
                
                %% Styling
                style A fill:#F0E68C, stroke:#333, stroke-width:2px
                style B fill:#87CEEB, stroke:#333, stroke-width:2px
            ---FRAME---
            flowchart TD
                %% Node definitions
                A[Request]
                B[Routing]
                C[Processing]
                
                %% Connections
                A --> B
                B --> C
                
                %% Styling
                style A fill:#F0E68C, stroke:#333, stroke-width:2px
                style B fill:#87CEEB, stroke:#333, stroke-width:2px
                style C fill:#FFD700, stroke:#333, stroke-width:2px
            """

            max_retries = 3
            retry_count = 0
            
            while retry_count < max_retries:
                try:
                    model = random.choice(["mixtral-8x7b-32768", "llama-3.3-70b-versatile"])
                    chat_completion = await self.client.chat.completions.create(
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": "Generate 5 frames showing progressive build-up of this diagram."}
                        ],
                        model=model,
                        temperature=0.2,
                        max_tokens=3000,
                        timeout=60
                    )
                    
                    if not chat_completion or not chat_completion.choices:
                        raise ValueError("No response from API")
                        
                    content = chat_completion.choices[0].message.content.strip()
                    print("content LLM response: ", content)
                    frames = [frame.strip() for frame in content.split("---FRAME---") if frame.strip()]
                    print("frames LLM response: ", frames)
                    
                    if len(frames) != 5:
                        raise ValueError(f"Expected 5 frames, got {len(frames)}")
                        
                    # Validate each frame
                    valid_frames = []
                    for i, frame in enumerate(frames):
                        try:
                            # Validate frame
                            await self._mermaid_to_image(frame,"gif")
                            valid_frames.append(frame)
                        except Exception as e:
                            print(f"Frame {i+1} validation failed: {str(e)}")
                            raise ValueError(f"Invalid frame {i+1}")

                    if len(valid_frames) == 5:
                        return valid_frames
                    
                except Exception as e:
                    print(f"Attempt {retry_count + 1} failed: {str(e)}")
                    retry_count += 1
                    if retry_count >= max_retries:
                        raise ValueError(f"Failed to generate valid frames: {str(e)}")
                    await asyncio.sleep(1)
            
            raise ValueError("Failed to generate valid frames")
            
        except Exception as e:
            print(f"Frame generation error: {str(e)}")
            print(traceback.format_exc())
            raise ValueError(f"Frame generation failed: {str(e)}")

    async def _mermaid_to_image(self, mermaid_code: str, diagram_type: str) -> bytes:
        """Convert Mermaid code to image"""
        try:
            # Clean up the Mermaid code
            mermaid_code = mermaid_code.replace("\\n", "\n").strip()
            
            # Encode mermaid code for URL
            encoded_code = base64.b64encode(mermaid_code.encode()).decode()
            # Add size parameters to URL for larger image
            # url = f"{self.mermaid_api_url}{encoded_code}?width=1200&height=800"
            if diagram_type == "gif":
                url = f"{self.mermaid_api_url}{encoded_code}?width=1024&height=1024"
            else:
                url = f"{self.mermaid_api_url}{encoded_code}"
            # url = f"{self.mermaid_api_url}{encoded_code}"
            
            timeout = aiohttp.ClientTimeout(total=30)
            async with aiohttp.ClientSession(timeout=timeout) as session:
                async with session.get(url) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        raise ValueError(f"Failed to generate image. Status: {response.status}, Error: {error_text}")
                    
                    image_data = await response.read()
                    if not image_data:
                        raise ValueError("Empty image data received")
                    
                    return image_data
                    
        except Exception as e:
            raise ValueError(f"Failed to convert Mermaid to image: {str(e)}")

    async def generate_diagram(self, prompt: str, diagram_type: str, generation_type: str) -> Tuple[str, Optional[List[str]]]:
        """Generate a diagram from a prompt"""
        try:
            if diagram_type == "gif":
                # Generate frames for GIF
                # frame_codes = await self._generate_frame_mermaid_codes(prompt, diagram_type, generation_type)
                # if not frame_codes:
                #     raise ValueError("No frames generated for GIF")
                
                # # Convert each frame to image
                # frame_images = []
                # for code in frame_codes:
                #     image_data = await self._mermaid_to_image(code)
                #     frame_images.append(image_data)
                
                # # Save as GIF
                # file_path = await storage.save_gif(frame_images, duration=1000)  # 1 second per frame
                
                # # Get URL
                # url = storage.get_file_url(file_path)
                # return url, frame_codes
                mermaid_code = await self._generate_mermaid_code(prompt, diagram_type, generation_type)
                print("Mermaid code: ", mermaid_code)
                if not mermaid_code:
                    raise ValueError("No diagram code generated")
                frame_codes = await self._generate_frame_mermaid_codes(mermaid_code, diagram_type, generation_type)
                print("Frame codes: ", frame_codes)
                if not frame_codes:
                    raise ValueError("No frames generated for GIF")
                
                # Convert each frame to image
                frame_images = []
                for code in frame_codes:
                    image_data = await self._mermaid_to_image(code,"gif")
                    frame_images.append(image_data)
                
                # Save as GIF
                file_path = await storage.save_gif(frame_images, duration=1000)  # 1 second per frame
                
                # Get URL
                url = storage.get_file_url(file_path)
                return url, frame_codes
                
            else:
                # Generate single image
                mermaid_code = await self._generate_mermaid_code(prompt, diagram_type, generation_type)
                if not mermaid_code:
                    raise ValueError("No diagram code generated")
                
                # Convert to image
                image_data = await self._mermaid_to_image(mermaid_code,"image")
                
                # Save image
                file_path = await storage.save_image(image_data)
                
                # Get URL
                url = storage.get_file_url(file_path)
                return url, [mermaid_code]
                
        except Exception as e:
            print(f"Error generating diagram: {str(e)}")
            print(traceback.format_exc())
            raise ValueError(f"Failed to generate diagram after 5 attempts: {str(e)}")

    async def optimize_image(self, image_data: bytes, format: str = "PNG") -> bytes:
        """Optimize image for web delivery"""
        try:
            # Open image with PIL
            image = Image.open(io.BytesIO(image_data))
            
            # Convert to RGB if necessary
            if image.mode not in ("RGB", "RGBA"):
                image = image.convert("RGB")
            
            # Maintain original size
            output = io.BytesIO()
            image.save(output, format=format, optimize=True, quality=95)
            return output.getvalue()
            
        except Exception as e:
            print(f"Error optimizing image: {str(e)}")
            raise ValueError(f"Failed to optimize image: {str(e)}")
