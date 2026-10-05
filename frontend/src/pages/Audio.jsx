import { useState } from "react";

function Audio() {
  const [actress, setActress] = useState([
    { id: 1, name: "Eimi Fukada" },
    { id: 2, name: "Yui Hatano" },
    { id: 3, name: "Rion" },
  ]);

  const [name, setName] = useState("");

  const [newName, setNewName] = useState(null);

  function handleChangeName(e) {
    setName(e.target.value);
  }
  function addActress() {
    const newActress = { id: actress.length + 1, name: name };

    setActress((actress) => [...actress, newActress]);
    setName("");
  }

  function deleteActress(id) {
    setActress((actress) => actress.filter((deletes) => deletes.id !== id));
  }

  function editId(id, oldName) {
    setNewName(id);
    setName(oldName);
  }

  function updateActress() {
    setActress((actress) =>
      actress.map((update) =>
        update.id === newName ? { ...update, name: name } : update,
      ),
    );

    setNewName(null);
    setName("");
  }

  return (
    <>
      <h1>Audio Page</h1>
      <p>
        {actress.map((add) => (
          <p key={add.id}>
            {add.name}
            <button onClick={() => editId(add.id, add.name)}>Sửa</button>
            <button onClick={() => deleteActress(add.id)}>Xóa</button>
          </p>
        ))}
      </p>
      <input
        type="text"
        value={name}
        placeholder="Nhập tên diễn viên"
        onChange={handleChangeName}
      />
      {editId === null ? (
        <button onClick={addActress}>Thêm diễn viên</button>
      ) : (
        <button onClick={updateActress}>Cập nhật</button>
      )}
    </>
  );
}

export default Audio;
