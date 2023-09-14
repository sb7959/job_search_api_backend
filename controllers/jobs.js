const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require("../errors/index");

const getAllJobs = async (req, res) => {
  const user = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  res
    .status(StatusCodes.OK)
    .json({ name: req.user.name, jobs: user, count: user.count });
  // res.status(200).send("get all jobs");
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const user = await Job.findOne({ _id: jobId, createdBy: userId });

  if (!user) {
    throw new NotFoundError(`no job with ${jobId} found`);
  }

  res.status(StatusCodes.OK).json({ user });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  // console.log(req.body);
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;

  if (company === "" || position === "") {
    throw new BadRequestError("company or position fields cant be empty");
  }

  const user = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new NotFoundError(`no job with ${jobId} exist`);
  }
  res.status(StatusCodes.OK).json({ user });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const user = await Job.findByIdAndRemove({ _id: jobId, createdBy: userId });

  if (!user) {
    throw new NotFoundError(`no job with ${jobId} exist`);
  }
  res.status(StatusCodes.OK).json({ user });
  //  res.status(200).send("delete job");
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
