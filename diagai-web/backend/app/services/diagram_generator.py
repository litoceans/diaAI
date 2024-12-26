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
        """Generate Mermaid code using Groq"""
        try:
            system_prompt = f"""You are an expert at creating Mermaid diagrams. Generate Mermaid code for a {generation_type} based on the user's prompt.
            Follow these rules:
            1. Only output valid Mermaid code
            2. Use clear and concise labels
            3. Use appropriate styling and colors
            4. Make the diagram professional and readable
            5. Start with the appropriate diagram type declaration (e.g., flowchart LR)
            6. Do not include any explanations, just the Mermaid code
            7. Use appropriate icons and styling based on these guidelines:
               - Use fa:fa-check for success/completion
               - Use fa:fa-times for errors/failures
               - Use fa:fa-cog for processes/operations
               - Use fa:fa-database for data storage
               - Use fa:fa-user for user/person
               - Use fa:fa-server for servers/APIs
               - Use fa:fa-cloud for cloud services
               - Style nodes with simple colors:
                 - style success fill:#90EE90
                 - style error fill:#FFB6C1
                 - style process fill:#87CEEB
                 - style data fill:#DDA0DD
                 - style user fill:#F0E68C
                 - style api fill:#98FB98
            
            Example output format:
            flowchart LR
                A[<i class='fa fa-user'></i> User]
                B[<i class='fa fa-cog'></i> Process]
                C[<i class='fa fa-check'></i> Success]
                A --> B --> C
                style A fill:#F0E68C
                style B fill:#87CEEB
                style C fill:#90EE90
            """

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
                        temperature=0.3,
                        max_tokens=1000,
                        timeout=60
                    )
                    
                    if not chat_completion or not chat_completion.choices:
                        raise ValueError("No response from Groq API")
                        
                    mermaid_code = chat_completion.choices[0].message.content.strip()
                    if not mermaid_code:
                        raise ValueError("Generated Mermaid code is empty")
                    
                    # Basic validation
                    if not mermaid_code.startswith("flowchart") and not mermaid_code.startswith("sequenceDiagram"):
                        raise ValueError("Invalid diagram type in generated code")
                    
                    # Test convert to image
                    try:
                        await self._mermaid_to_image(mermaid_code)
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

    async def _generate_frame_mermaid_codes(self, prompt: str, diagram_type: str, generation_type: str) -> List[str]:
        """Generate multiple Mermaid codes for GIF frames"""
        try:
            # Map generation_type to Mermaid syntax
            diagram_syntax_map = {
                "flowchart": "flowchart TD",
                "sequence": "sequenceDiagram",
                "class": "classDiagram",
                "state": "stateDiagram-v2",
                "er": "erDiagram",
                "gantt": "gantt",
                "pie": "pie",
                "mindmap": "mindmap"
            }
            
            mermaid_syntax = diagram_syntax_map.get(generation_type.lower(), "flowchart TD")
            
            system_prompt = f"""You are an expert at creating animated Mermaid diagrams. Generate exactly 3 frames showing progression or state changes, based on the user's prompt.
            Follow these rules strictly:
            1. Generate EXACTLY 3 frames showing progression
            2. Each frame MUST start with '{mermaid_syntax}'
            3. Each frame should show a clear progression or state change
            4. Use consistent styling across frames
            5. Separate frames with ---FRAME---
            6. Use appropriate icons and styling based on these guidelines:
               - Use fa:fa-check for success/completion
               - Use fa:fa-times for errors/failures
               - Use fa:fa-cog for processes/operations
               - Use fa:fa-database for data storage
               - Use fa:fa-user for user/person
               - Use fa:fa-server for servers/APIs
               - Use fa:fa-cloud for cloud services
               - Style nodes with simple colors:
                 - style success fill:#90EE90
                 - style error fill:#FFB6C1
                 - style process fill:#87CEEB
                 - style data fill:#DDA0DD
                 - style user fill:#F0E68C
                 - style api fill:#98FB98
            
            Example output format:
            {mermaid_syntax}
                A[Start] --> B[Process]
            ---FRAME---
            {mermaid_syntax}
                A[Start] --> B[Process]
                B --> C[Middle]
            ---FRAME---
            {mermaid_syntax}
                A[Start] --> B[Process]
                B --> C[Middle]
                C --> D[End]
            """

            max_retries = 5
            retry_count = 0
            
            while retry_count < max_retries:
                try:
                    random_models = ["mixtral-8x7b-32768","llama-3.1-8b-instant","llama-3.3-70b-versatile"]
                    chat_completion = await self.client.chat.completions.create(
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": prompt}
                        ],
                        model=random.choice(random_models),
                        temperature=0.3,
                        max_tokens=2000,
                        timeout=60
                    )
                    
                    if not chat_completion or not chat_completion.choices:
                        raise ValueError("No response from Groq API")
                        
                    content = chat_completion.choices[0].message.content.strip()
                    frames = [frame.strip() for frame in content.split("---FRAME---") if frame.strip()]
                    
                    if not frames:
                        raise ValueError("No valid frames generated")
                    
                    if len(frames) != 3:
                        raise ValueError(f"Wrong number of frames. Expected 3, got {len(frames)}")
                        
                    # Validate each frame
                    valid_frames = []
                    for i, frame in enumerate(frames):
                        # Ensure frame starts with correct syntax
                        if not frame.lower().startswith(mermaid_syntax.lower()):
                            # Try to fix the syntax
                            frame = f"{mermaid_syntax}\n{frame}"
                        
                        # Test convert to image
                        try:
                            await self._mermaid_to_image(frame)
                            valid_frames.append(frame)
                        except Exception as e:
                            print(f"Failed to validate frame {i+1}: {str(e)}")
                            print(f"Frame content: {frame[:100]}...")
                            raise ValueError(f"Invalid Mermaid code in frame {i+1}")
                    
                    if len(valid_frames) == 3:
                        return valid_frames
                    
                except Exception as e:
                    print(f"Error on attempt {retry_count + 1}: {str(e)}")
                    retry_count += 1
                    if retry_count >= max_retries:
                        raise ValueError(f"Failed to generate valid frames after {max_retries} attempts: {str(e)}")
                    await asyncio.sleep(1)  # Wait before retry
            
            raise ValueError(f"Failed to generate valid frames after {max_retries} attempts")
            
        except Exception as e:
            print(f"Error generating Mermaid frame codes: {str(e)}")
            print(traceback.format_exc())
            raise ValueError(f"Failed to generate Mermaid frames: {str(e)}")

    async def _mermaid_to_image(self, mermaid_code: str) -> bytes:
        """Convert Mermaid code to image"""
        try:
            # Clean up the Mermaid code
            mermaid_code = mermaid_code.replace("\\n", "\n").strip()
            
            # Encode mermaid code for URL
            encoded_code = base64.b64encode(mermaid_code.encode()).decode()
            # Add size parameters to URL for larger image
            url = f"{self.mermaid_api_url}{encoded_code}?width=1200&height=800"
            
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
                frame_codes = await self._generate_frame_mermaid_codes(prompt, diagram_type, generation_type)
                if not frame_codes:
                    raise ValueError("No frames generated for GIF")
                
                # Convert each frame to image
                frame_images = []
                for code in frame_codes:
                    image_data = await self._mermaid_to_image(code)
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
                image_data = await self._mermaid_to_image(mermaid_code)
                
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
