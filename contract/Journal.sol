// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title OnChain AI Journal
/// @notice Stores AI-summarized journal entries by username — gaslessly on Status Network
/// @dev Server wallet signs all transactions. Users only need a name, no wallet required.
contract Journal {

    struct Entry {
        string raw;        // original user input
        string summary;    // AI-generated summary
        uint256 timestamp;
    }

    // username => list of entries
    mapping(string => Entry[]) private entries;

    // username => exists (to track all users)
    mapping(string => bool) private userExists;
    string[] private allUsers;

    event EntryAdded(string indexed username, uint256 index, uint256 timestamp);

    /// @notice Add a new journal entry for a username
    function addEntry(string calldata username, string calldata raw, string calldata summary) external {
        require(bytes(username).length > 0, "Username cannot be empty");
        require(bytes(raw).length > 0, "Entry cannot be empty");

        if (!userExists[username]) {
            userExists[username] = true;
            allUsers.push(username);
        }

        entries[username].push(Entry({
            raw: raw,
            summary: summary,
            timestamp: block.timestamp
        }));

        emit EntryAdded(username, entries[username].length - 1, block.timestamp);
    }

    /// @notice Get total number of entries for a username
    function getEntryCount(string calldata username) external view returns (uint256) {
        return entries[username].length;
    }

    /// @notice Get a specific entry by username and index
    function getEntry(string calldata username, uint256 index)
        external view
        returns (string memory raw, string memory summary, uint256 timestamp)
    {
        require(index < entries[username].length, "Index out of bounds");
        Entry storage e = entries[username][index];
        return (e.raw, e.summary, e.timestamp);
    }

    /// @notice Get all summaries for a username
    function getAllSummaries(string calldata username) external view returns (string[] memory) {
        uint256 count = entries[username].length;
        string[] memory summaries = new string[](count);
        for (uint256 i = 0; i < count; i++) {
            summaries[i] = entries[username][i].summary;
        }
        return summaries;
    }

    /// @notice Check if a username has any entries
    function userHasEntries(string calldata username) external view returns (bool) {
        return userExists[username];
    }

    /// @notice Get total number of unique users
    function getUserCount() external view returns (uint256) {
        return allUsers.length;
    }
}
