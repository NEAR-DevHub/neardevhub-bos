const { RFP_TIMELINE_STATUS } = VM.require(
  `${REPL_TREASURY_TEMPLAR}/widget/core.common`
) || { RFP_TIMELINE_STATUS: {} };

const stepsArray = [1, 2, 3];
const timeline = props.timeline;
const disabled = props.disabled;
const setTimeline = props.setTimeline ?? (() => {});

const TimelineStatusOptions = [
  {
    label: "Accepting Submissions",
    value: { status: RFP_TIMELINE_STATUS.ACCEPTING_SUBMISSIONS },
  },
  {
    label: "Evaluation",
    value: {
      status: RFP_TIMELINE_STATUS.EVALUATION,
    },
  },
  {
    label: "Proposal Selected",
    value: {
      status: RFP_TIMELINE_STATUS.PROPOSAL_SELECTED,
    },
  },
  {
    label: "Cancelled",
    value: {
      status: RFP_TIMELINE_STATUS.CANCELLED,
    },
  },
];

const Container = styled.div`
  .circle-lg {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    border: 1px solid grey;
  }

  .green-fill {
    background-color: rgb(4, 164, 110) !important;
    border-color: rgb(4, 164, 110) !important;
    color: white !important;
  }

  .yellow-fill {
    border-color: #ff7a00 !important;
  }

  .vertical-line {
    width: 2px;
    height: 85px;
    background-color: lightgrey;
  }

  @media screen and (max-width: 970px) {
    .vertical-line {
      height: 70px !important;
    }
  }

  @media screen and (max-width: 570px) {
    .vertical-line {
      height: 65px !important;
    }
  }
`;
const selectedTimelineStatusIndex = useMemo(
  () =>
    TimelineStatusOptions.findIndex((i) => i.value.status === timeline.status),
  [timeline]
);

const TimelineItems = ({ title, children, value, values }) => {
  const indexOfCurrentItem = TimelineStatusOptions.findIndex((i) =>
    Array.isArray(values)
      ? values.includes(i.value.status)
      : value === i.value.status
  );
  let color = "transparent";
  let statusIndex = selectedTimelineStatusIndex;
  // index 2,3 is of decision
  if (selectedTimelineStatusIndex === 3) {
    statusIndex = 2;
  }
  if (statusIndex === indexOfCurrentItem) {
    color = "#FEF6EE";
  }
  if (statusIndex > indexOfCurrentItem) {
    color = "#EEFEF0";
  }
  // cancelled
  if (
    statusIndex === 2 &&
    (values ?? []).includes(RFP_TIMELINE_STATUS.CANCELLED) &&
    timeline.status === RFP_TIMELINE_STATUS.CANCELLED
  ) {
    color = "#F4F4F4";
  }

  return (
    <div
      className="p-2 rounded-3"
      style={{
        backgroundColor: color,
      }}
    >
      <div className="h6 text-black"> {title}</div>
      <div className="text-sm">{children}</div>
    </div>
  );
};

return (
  <Container className="d-flex flex-column gap-2">
    {!disabled && (
      <div className="d-flex flex-column gap-2">
        <h6 className="mb-0">Status</h6>
        <Widget
          src={`${REPL_TREASURY_TEMPLAR}/widget/components.molecule.DropDown`}
          props={{
            options: TimelineStatusOptions,
            selectedValue: TimelineStatusOptions.find(
              (i) => i.value.status === timeline.status
            ),
            onUpdate: (v) => {
              setTimeline({ status: v.value.status });
            },
          }}
        />
      </div>
    )}
    <div className="d-flex gap-3 mt-2">
      <div className="d-flex flex-column mt-4">
        {stepsArray.map((_, index) => {
          const indexOfCurrentItem = index;
          let color = "";
          let statusIndex = selectedTimelineStatusIndex;
          // index 2,3 is of decision
          if (selectedTimelineStatusIndex === 3) {
            statusIndex = 2;
          }
          const current = statusIndex === indexOfCurrentItem;
          const completed =
            statusIndex > indexOfCurrentItem ||
            timeline.status === RFP_TIMELINE_STATUS.PROPOSAL_SELECTED ||
            timeline.status === RFP_TIMELINE_STATUS.CANCELLED;
          return (
            <div className="d-flex flex-column align-items-center gap-1">
              <div
                className={
                  "circle-lg " +
                  (completed && " green-fill ") +
                  (current && !completed && " yellow-fill ")
                }
              >
                {completed && (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "120%" }}
                  >
                    <i className="bi bi-check"></i>
                  </div>
                )}
              </div>
              {index !== stepsArray.length - 1 && (
                <div
                  className={
                    "vertical-line " +
                    (completed && " green-fill ") +
                    (current && " yellow-fill ")
                  }
                ></div>
              )}
            </div>
          );
        })}
      </div>
      <div className="d-flex flex-column gap-3">
        <TimelineItems
          title="1) Accepting Submissions"
          value={RFP_TIMELINE_STATUS.ACCEPTING_SUBMISSIONS}
        >
          <div>During this stage, the RFP is still open for submissions.</div>
        </TimelineItems>
        <TimelineItems
          title="2) Evaluation"
          value={RFP_TIMELINE_STATUS.EVALUATION}
        >
          <div>
            This RFP is closed for submissions. All submitted proposals are
            under review.
          </div>
        </TimelineItems>
        <TimelineItems
          title="3) Decision"
          values={[
            RFP_TIMELINE_STATUS.PROPOSAL_SELECTED,
            RFP_TIMELINE_STATUS.CANCELLED,
          ]}
        >
          <div className="d-flex flex-column gap-2">
            <div>Sponsor makes a final decision:</div>
            <Widget
              src={`${REPL_TREASURY_TEMPLAR}/widget/components.molecule.RadioButton`}
              props={{
                value: "",
                label: <div className="fw-bold">Proposal Selected</div>,
                disabled: disabled,
                isChecked:
                  timeline.status === RFP_TIMELINE_STATUS.PROPOSAL_SELECTED,
                onClick: (v) => {
                  if (v) {
                    setTimeline({
                      status: RFP_TIMELINE_STATUS.PROPOSAL_SELECTED,
                    });
                  }
                },
              }}
            />
            <Widget
              src={`${REPL_TREASURY_TEMPLAR}/widget/components.molecule.RadioButton`}
              props={{
                value: "",
                disabled: disabled,
                label: <div className="fw-bold">RFP Cancelled</div>,
                isChecked: timeline.status === RFP_TIMELINE_STATUS.CANCELLED,
                onClick: (v) => {
                  if (v) {
                    setTimeline({
                      status: RFP_TIMELINE_STATUS.CANCELLED,
                    });
                  }
                },
              }}
            />
          </div>
        </TimelineItems>
      </div>
    </div>
  </Container>
);
