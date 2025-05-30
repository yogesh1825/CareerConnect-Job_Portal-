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
    skills: user?.profile?.skills?.join(", ") || "",
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
    try {
      setLoading(true);
      const formData = new FormData();
      
      // Add all fields to formData with correct field names
      formData.append("fullname", input.fullname);
      formData.append("email", input.email);
      formData.append("phoneNumber", input.phoneNumber);
      formData.append("bio", input.bio);
      formData.append("skills", input.skills);
      
      if (input.file) {
        formData.append("file", input.file);
      }

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
        toast.success("Profile updated successfully");
        setOpen(false);
      } else {
        toast.error(res.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
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
            <form onSubmit={submitHandler}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-3">
                  <Label htmlFor="fullname" className="">
                    Name :
                  </Label>
                  <Input
                    id="fullname"
                    name="fullname"
                    value={input.fullname}
                    onChange={changeEventHandler}
                    type="text"
                    className="col-span-3"
                    placeholder="Enter your full name"
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
                    placeholder="Enter your email"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-3">
                  <Label htmlFor="phoneNumber" className="">
                    Number :
                  </Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={input.phoneNumber}
                    onChange={changeEventHandler}
                    type="text"
                    className="col-span-3"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-3">
                  <Label htmlFor="bio" className="">
                    Bio :
                  </Label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={input.bio}
                    onChange={changeEventHandler}
                    className="col-span-3 min-h-[100px] p-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Tell us about yourself"
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
                    placeholder="Enter your skills (comma separated)"
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
                  <Button className="w-full my-4">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
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
