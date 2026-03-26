import taskModel from "../models/taskModel.js";

export const createTask = async (req, res) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ message: 'Voce precisa estar logado' });
        }

        const { title, description, start, end } = req.body;
        const task = await taskModel.create({ title, description, start, end, user: req.user._id });
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: 'Ocorreu um erro ao criar a tarefa' });
        console.log(error)
    }
};

export const getTasks = async (req, res) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ message: 'Voce precisa estar logado' });
        }

        const tasks = await taskModel.find({ user: req.user._id }).populate('user', 'email');
        res.status(200).json(tasks);
    } catch (error) {
        res.status(400).json({ message: 'Ocorreu um erro ao buscar as tarefas' });
    }
};

export const updateTask = async (req, res) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ message: 'Voce precisa estar logado' });
        }

        const { id } = req.params;
        const { title, description, start, end, status } = req.body;
        const task = await taskModel.findByIdAndUpdate(
            id,
            { title, description, start, end, status },
            { new: true }
        );
        res.status(200).json(task);
    } catch (error) {
        res.status(400).json({ message: 'Ocorreu um erro ao atualizar a tarefa' });
    }
};

export const deleteTask = async (req, res) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ message: 'Voce precisa estar logado' });
        }

        const { id } = req.params;
        await taskModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Tarefa excluída com sucesso' });
    } catch (error) {
        res.status(400).json({ message: 'Ocorreu um erro ao excluir a tarefa' });
    }
};
