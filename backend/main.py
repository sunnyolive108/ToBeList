from fastapi import FastAPI
from routers import habits
from models.database import initialize_database
from fastapi.middleware.cors import CORSMiddleware

# Initialize the database before starting the app
initialize_database()

# Initialize the FastAPI app
app = FastAPI(
    title="Habit Tracker API",
    description="An API for managing habits and analyzing productivity",
    version="1.0.0"
)

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(habits.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Habit Tracker API"}
