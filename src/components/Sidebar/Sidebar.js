import { Avatar } from "@material-ui/core";
import React, { useEffect, useState, useCallback } from "react";
import "./Sidebar.css";
import { SearchOutlined } from "@material-ui/icons";
import SidebarRoom from "../SidebarRoom/SidebarRoom";
import SidebarMenu from "../SidebarMenu/SidebarMenu";
import axios from "../../axios";
import pusher from "../../pusher";

const roomUpdateChannel = pusher.subscribe("roomsUpdate");

function Sidebar() {
    const user = JSON.parse(window.localStorage.getItem("myChatUser"));
    const [rooms, setRooms] = useState([]);

    const updateRooms = useCallback(() => {
        axios.get(`/roomList/${user.email}`).then((response) => {
            const roomsArray = response.data.sort((x, y) => {
                return new Date(y.lastTimestamp) - new Date(x.lastTimestamp);
            });
            setRooms(roomsArray);
        });
    }, []);

    useEffect(() => {
        roomUpdateChannel.bind("someUpdate", () => {
            updateRooms();
        });

        return () => {
            roomUpdateChannel.unbind_all();
        };
    }, [updateRooms]);

    useEffect(() => {
        updateRooms();
    }, [updateRooms]);

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar src={user.pic} />
                <div className="sidebar__headerInfo">
                    <h2>{user.name}</h2>
                    <h3>{user.email}</h3>
                </div>
                <SidebarMenu />
            </div>
            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchOutlined />
                    <input placeholder="Search your room" type="text" />
                </div>
            </div>
            <div className="sidebar__rooms">
                {rooms.map((room) => (
                    <SidebarRoom
                        roomPic={room.pic}
                        roomName={`${room.name.substring(0, 30)}${
                            room.name.length > 30 ? "..." : ""
                        }`}
                        lastMessage={`${room.lastMessage.substring(0, 32)}${
                            room.lastMessage.length > 32 ? "..." : ""
                        }`}
                        roomId={room._id}
                        key={room._id}
                    />
                ))}
            </div>
        </div>
    );
}

export default Sidebar;
