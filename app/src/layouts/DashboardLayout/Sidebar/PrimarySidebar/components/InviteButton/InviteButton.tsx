import React, { useCallback } from "react";
import { trackSidebarClicked } from "modules/analytics/events/common/onboarding/sidebar";
import InviteIcon from "assets/icons/invite.svg?react";
import { getAvailableTeams, getIsWorkspaceMode } from "store/features/teams/selectors";
import { getUserAuthDetails } from "store/slices/global/user/selectors";
import { useDispatch, useSelector } from "react-redux";
import { globalActions } from "store/slices/global/slice";
import { RQButton } from "lib/design-system/components";
import { trackInviteTeammatesClicked } from "modules/analytics/events/common/teams";
import { SOURCE } from "modules/analytics/events/common/constants";

const InviteButton: React.FC = () => {
  const dispatch = useDispatch();
  const availableTeams = useSelector(getAvailableTeams);
  const isWorkspaceMode = useSelector(getIsWorkspaceMode);
  const user = useSelector(getUserAuthDetails);

  const handleInviteClick = useCallback(() => {
    trackInviteTeammatesClicked(SOURCE.SIDEBAR_INVITE_BUTTON);
    if (!user?.loggedIn) {
      dispatch(
        globalActions.toggleActiveModal({
          modalName: "authModal",
          newValue: true,
          newProps: { eventSource: SOURCE.SIDEBAR_INVITE_BUTTON },
        })
      );
      return;
    }

    if (isWorkspaceMode) {
      dispatch(
        globalActions.toggleActiveModal({
          modalName: "inviteMembersModal",
          newValue: true,
          newProps: { source: SOURCE.SIDEBAR_INVITE_BUTTON },
        })
      );
    } else if (availableTeams?.length === 0) {
      dispatch(
        globalActions.toggleActiveModal({
          modalName: "createWorkspaceModal",
          newValue: true,
          newProps: { source: SOURCE.SIDEBAR_INVITE_BUTTON },
        })
      );
    } else {
      dispatch(globalActions.toggleActiveModal({ modalName: "switchWorkspaceModal", newValue: true }));
    }
  }, [availableTeams?.length, dispatch, isWorkspaceMode, user?.loggedIn]);

  return (
    <>
      <RQButton
        type="text"
        onClick={() => {
          handleInviteClick();
          trackSidebarClicked("invite");
        }}
        className="primary-sidebar-link w-full"
      >
        <span className="icon__wrapper">{<InviteIcon />}</span>
        <span className="link-title">{"Invite"}</span>
      </RQButton>
    </>
  );
};

export default InviteButton;
