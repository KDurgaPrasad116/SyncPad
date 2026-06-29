import type { ActiveUser } from "../../types/chat";

interface WorkspaceHeaderProps {
  roomCode: string;
  userName: string;

  activeUsers: ActiveUser[];

  showUserList: boolean;

  setShowUserList: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export default function WorkspaceHeader({
  roomCode,
  userName,
  activeUsers,
  showUserList,
  setShowUserList,
}: WorkspaceHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1rem",
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            fontSize: "1.2rem",
          }}
        >
          Workspace: {roomCode}
        </h2>

        <p
          style={{
            margin: "0.25rem 0 0",
            color: "#666",
            fontSize: ".85rem",
          }}
        >
          Logged in as <strong>{userName}</strong>
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          position: "relative",
        }}
      >
        <button
          onClick={() =>
            setShowUserList(!showUserList)
          }
          style={{
            padding: ".35rem .75rem",
            backgroundColor: "#e3f2fd",
            color: "#0d6efd",
            border: "none",
            borderRadius: "16px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          👥 {activeUsers.length}
        </button>

        <span
          style={{
            padding: ".35rem .75rem",
            backgroundColor: "#e8f5e9",
            color: "#2e7d32",
            borderRadius: "16px",
            fontWeight: "bold",
            fontSize: ".85rem",
          }}
        >
          Live
        </span>

        {showUserList && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              width: "200px",
              marginTop: "8px",
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow:
                "0 4px 12px rgba(0,0,0,.15)",
              padding: "12px",
              zIndex: 100,
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                fontSize: ".75rem",
                borderBottom: "1px solid #eee",
                paddingBottom: "6px",
                marginBottom: "8px",
              }}
            >
              Active Users
            </div>

            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {activeUsers.map((u) => (
                <li
                  key={u.id}
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: u.color,
                    }}
                  />

                  {u.name}

                  {u.name === userName && " (You)"}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}