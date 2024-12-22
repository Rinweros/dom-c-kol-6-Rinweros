import React, { useState, createContext, useContext } from "react";

const UserContext = createContext();

const users = [
  { id: "674ca27e6274e4d6c0c34f91", name: "FirtsUser", role: "Owner" },
  { id: "674ca27e6274e4d6c0c34f92", name: "SecondUser", role: "Member" },
  { id: "676826b2bac3fc5627331932", name: "ThirdUser", role: "Guest" },
];

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(users[0]);

  const changeUser = (userId) => {
    const newUser = users.find((user) => user.id === userId);
    if (newUser) setCurrentUser(newUser);
  };

  return (
    <UserContext.Provider value={{ currentUser, changeUser, users }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

const UserSwitcher = () => {
  const { currentUser, changeUser, users } = useUser();

  return (
    <div className="user-switcher">
      <h3 className="user-title">
        Aktuální uživatel: <strong>{currentUser.name}</strong> ({currentUser.role})
      </h3>
      <select
        className="user-dropdown"
        value={currentUser.id}
        onChange={(e) => changeUser(e.target.value)}
      >
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} ({user.role})
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserSwitcher;
