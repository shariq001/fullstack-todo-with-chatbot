"""
MCP Server for Todo AI Chatbot.

This module initializes the Model Context Protocol server and registers
all task management tools. The server embeds into the main FastAPI application
and exposes tools via the /mcp endpoint using streamable HTTP transport.
"""
from mcp.server.fastmcp import FastMCP
from .mcp_tools.task_tools import (
    add_task,
    list_tasks,
    update_task,
    complete_task,
    delete_task,
)


# Initialize the MCP server instance
mcp = FastMCP(
    name="Todo MCP Server",
    instructions="Task management tools for the Todo AI Chatbot",
    stateless_http=True,
    json_response=True,
)

# Register all task management tools
mcp.tool()(add_task)
mcp.tool()(list_tasks)
mcp.tool()(update_task)
mcp.tool()(complete_task)
mcp.tool()(delete_task)


def get_mcp_app():
    """
    Get the MCP server application instance for mounting in FastAPI.

    Returns:
        The MCP server as a mountable ASGI application
    """
    return mcp.streamable_http_app()


if __name__ == "__main__":
    # Run the MCP server standalone (for testing/dev purposes)
    mcp.run(transport="streamable-http", host="0.0.0.0", port=8001)
