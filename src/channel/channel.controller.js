import axios from "axios";
import User from "../users/user.model.js";
import Channel from "./channel.model.js";

export const getChannelDetails = async (req, res) => {
  try {
    const { channelId } = req.params;

    const channel = await Channel.findById(channelId);

    if (!channel || !channel.isActive) {
      return res.status(404).send("Channel not found");
    }

    const user = await User.findOne({ channel: channelId }, { username: 1 });

    const streamUrl = `http://127.0.0.1:8000/live/${channel.streamKey}.flv`;

    const requestData = await axios.get("http://127.0.0.1:8000/api/streams");

    const activeStreams = requestData.data;

    let liveStreams = [];

    for (const streamId in activeStreams?.live) {
      if (
        activeStreams.live[streamId].publisher &&
        activeStreams.live[streamId].publisher !== null
      ) {
        liveStreams.push(streamId);
      }
    }

    const isOnline = liveStreams.includes(channel.streamKey);

    return res.status(200).json({
      id: channel._id,
      title: channel.title,
      description: channel.description,
      username: user.username,
      isOnline,
      streamUrl: streamUrl,
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send("Channel not found, please check yout channel url");
  }
};

export const getChannels = async (req, res) => {
  try {
    const users = await User.find(
      {},
      {
        channel: 1,
        username: 1,
      }
    ).populate("channel");

    const requestData = await axios.get("http://127.0.0.1:8000/api/streams");

    const activeStreams = requestData.data;

    let liveStreams = [];

    for (const streamId in activeStreams?.live) {
      if (
        activeStreams.live[streamId].publisher &&
        activeStreams.live[streamId].publisher !== null
      ) {
        liveStreams.push(streamId);
      }
    }

    const channels = users
      .filter((u) => u.channel.isActive)
      .map((user) => {
        return {
          id: user.channel._id,
          title: user.channel.title,
          avatarUrl: user.channel.avatarUrl,
          username: user.username,
          isOnline: liveStreams.includes(user.channel.streamKey),
        };
      });

    return res.status(200).json({
      channels,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send("Somthing went wrong");
  }
};

export const postFollowChannel = async (req, res) => {
  try {
    const { uid } = req.user;
    const { channelId } = req.body;

    const userData = await User.findById(uid, { followedChannels: 1 });

    if (userData.followedChannels.includes(channelId)) {
      return res.status(400).send("You are already following this channel");
    }

    userData.followedChannels.push(channelId);

    await userData.save();

    return res.status(200).send("Channel followed successfully");
  } catch (e) {
    console.log(e);
    return res.status(500).send("Somthing went wrong");
  }
};

export const getFollowedChannels = async (req, res) => {
  try {
    const { uid } = req.user;

    const { followedChannels } = await User.findById(uid, {
      followedChannels: 1,
    });

    return res.status(200).json({
      followedChannels,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send("Error occured wen fetichig channels");
  }
};
