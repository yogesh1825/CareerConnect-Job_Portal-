import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setUser } from "@/redux/authSlice";
import store from "@/redux/store";
import { USER_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const UpdateProfile = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.map((skill) => skill) || "",
    file: user?.profile?.resume || "",
  });
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
    setOpen(false);
    console.log(input);
  };

  return (
    <div>
      <Dialog open={open}>
        <DialogContent
          className="sm:max-w-[425px]"
          onInteractOutside={() => setOpen(false)}
        >
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
            <form action="" onSubmit={submitHandler}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-3">
                  <Label htmlFor="name" className="">
                    Name :
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={input.fullname}
                    onChange={changeEventHandler}
                    type="text"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-3">
                  <Label htmlFor="email" className="">
                    Email :
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    value={input.email}
                    onChange={changeEventHandler}
                    type="email"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-3">
                  <Label htmlFor="number" className="">
                    Number :
                  </Label>
                  <Input
                    id="number"
                    name="number"
                    value={input.phoneNumber}
                    onChange={changeEventHandler}
                    type="text"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-3">
                  <Label htmlFor="bio" className="">
                    Bio :
                  </Label>
                  <Input
                    id="bio"
                    name="bio"
                    value={input.bio}
                    onChange={changeEventHandler}
                    type="text"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-3">
                  <Label htmlFor="skills" className="">
                    Skills :
                  </Label>
                  <Input
                    id="skills"
                    name="skills"
                    value={input.skills}
                    onChange={changeEventHandler}
                    type="text"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="file" className="text-right">
                    Resume
                  </Label>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    accept="application/pdf"
                    onChange={changeFileHandler}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                {loading ? (
                  <Button className="w-full my-4 ">
                    {" "}
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait{" "}
                  </Button>
                ) : (
                  <Button type="submit" className="w-full my-4 rounded-full">
                    Update
                  </Button>
                )}
              </DialogFooter>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateProfile;
