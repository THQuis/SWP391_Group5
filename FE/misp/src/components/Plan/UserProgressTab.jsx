// components/UserProgressTab.js
import React from "react";
import { Table, Button } from "react-bootstrap";

const UserProgressTab = ({ userProgressList, users, onSelectUser }) => {
    const renderUserRows = () => [
        ...userProgressList.map((u, idx) => (
            <tr key={"sample-user-" + u.userId}>
                <td>{idx + 1}</td>
                <td>{u.name}</td>
                <td>{u.quitCount}</td>
                <td>{u.savedMoney.toLocaleString()} vnđ</td>
                <td>
                    <Button variant="outline-primary" size="sm" onClick={() => onSelectUser(u)}>
                        Xem chi tiết
                    </Button>
                </td>
            </tr>
        )),
        ...users.map((u, idx) => (
            <tr key={u.userId}>
                <td>{userProgressList.length + idx + 1}</td>
                <td>{u.name}</td>
                <td>{u.quitCount}</td>
                <td>{u.savedMoney.toLocaleString()} vnđ</td>
                <td>
                    <Button variant="outline-primary" size="sm" onClick={() => onSelectUser(u)}>
                        Xem chi tiết
                    </Button>
                </td>
            </tr>
        ))
    ];

    return (
        <Table bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Tên</th>
                    <th>Số điều đã bỏ</th>
                    <th>Số tiền tiết kiệm</th>
                    <th>Xem tiến trình chi tiết</th>
                </tr>
            </thead>
            <tbody>{renderUserRows()}</tbody>
        </Table>
    );
};

export default UserProgressTab;
